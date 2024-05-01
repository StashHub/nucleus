import { env } from "@/env.mjs";
import {
  RedshiftDataClient,
  ExecuteStatementCommand,
  type SqlParameter,
  DescribeStatementCommand,
  type ExecuteStatementCommandInput,
  type DescribeStatementCommandOutput,
  type GetStatementResultCommandInput,
  GetStatementResultCommand,
  StatusString,
} from "@aws-sdk/client-redshift-data";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

type QueryRecordValueType =
  | string
  | number
  | Uint8Array
  | boolean
  | null
  | undefined;

type QueryRecord = Record<string, QueryRecordValueType>;

/**
 * Class wrapper around the RedshiftDataClient.
 *
 * It handles assuming a role and creates a RedshiftDataClient with
 * the credentials from the assumed role.
 *
 * @export
 * @class RedshiftService
 * @example
 * const client = new RedshiftService();
 * const query = `SELECT * FROM public.my_table`
 * const results = await client.executeStatement<{ name: string }>({ sql: query})
 */
export class RedshiftService {
  private client?: RedshiftDataClient;
  private dateRoleAssumed: Date | null = null;

  /**
   * Executes a SQL query and await results
   *
   * @param params The query/parameter to execute on Redshift
   * @returns {T[]} The result of the query
   * @throws {Error} If the query fails
   *
   * @example
   * type QueryResults = { id: number; name: string; }
   * const query = `SELECT * FROM public.my_table`
   * const results = await client.executeStatement<QueryResults>({ sql: query})
   */
  async executeStatement<T>(params: {
    sql: string;
    parameters?: SqlParameter[];
  }): Promise<T[]> {
    const input: ExecuteStatementCommandInput = {
      ClusterIdentifier: env.AWS_REDSHIFT_CLUSTER,
      Database: "analytics",
      SecretArn: env.AWS_SA_SECRET_ARN,
      Sql: params.sql,
      Parameters: params.parameters,
    };

    const client = await this.initializeClient();
    const command = new ExecuteStatementCommand(input);
    const { Id: queryId } = await client.send(command);

    const statementResult = await this.executeSynchronousWait(queryId!);
    return statementResult as T[];
  }

  /**
   * Describes the status of the statement execution and returns the
   * status, which can be used to know if the query is still in
   * progress/completed/failed
   *
   * @param queryId
   * @returns {DescribeStatementCommandOutput}
   * @throws {Error} if execution fails
   */
  private async describeStatement(
    queryId: string,
  ): Promise<DescribeStatementCommandOutput> {
    const client = await this.initializeClient();
    const command = new DescribeStatementCommand({ Id: queryId });
    const response: DescribeStatementCommandOutput = await client.send(command);
    if (response.Error) {
      console.log("DescribeStatement", response.Error);
      throw new Error(response.Error);
    }
    return response;
  }

  /**
   * Wait for a synchronous query execution to finish and retrieve the result
   *
   * @param queryId
   * @returns
   * @throws {Error} If the query fails
   */
  private async executeSynchronousWait<T>(queryId: string): Promise<T[]> {
    let attempts = 0;
    const MAX_WAIT_CYCLES = 20;

    while (attempts < MAX_WAIT_CYCLES) {
      attempts++;
      await this.sleep(1);

      const statement: DescribeStatementCommandOutput =
        await this.describeStatement(queryId);

      const {
        Status: queryStatus,
        Error: descStatError,
        HasResultSet: descStateHasResultSet,
      } = statement;

      console.log(`Query Status: ${queryStatus} | QueryId: ${statement.Id}`);

      if (queryStatus === StatusString.FAILED) {
        throw new Error(`SQL failed: ${queryId}: \n Error: ${descStatError}`);
      } else if (queryStatus === StatusString.FINISHED) {
        if (descStateHasResultSet) {
          return await this.getStatementResult<T>(queryId);
        }
        break;
      } else {
        console.log(`Working... Status: ${queryStatus}`);
      }

      if (attempts >= MAX_WAIT_CYCLES) {
        throw new Error(
          `Limit for MAX_WAIT_CYCLES has been reached before the query was able to finish. 
           \n Query status: ${queryStatus} for query id: ${queryId}`,
        );
      }
    }

    return [];
  }

  /**
   * Retrieve the result of the query, cleans the format from data API
   * and returns the result as a simple Typed object.
   *
   * @param queryId
   * @returns {T[]}
   */
  private async getStatementResult<T>(queryId: string): Promise<T[]> {
    const client = await this.initializeClient();

    let nextToken: string | undefined = undefined;
    const items: T[] = [];

    try {
      do {
        const input: GetStatementResultCommandInput = {
          Id: queryId,
          NextToken: nextToken,
        };

        const response = await client.send(
          new GetStatementResultCommand(input),
        );

        const columnNames: string[] =
          response.ColumnMetadata?.map((column) => column.name!) ?? [];

        response.Records?.forEach((record) => {
          const newRecord: QueryRecord = {};
          columnNames.forEach((name, index) => {
            if (record[index]?.isNull) {
              newRecord[name] = null;
            } else {
              newRecord[name] = this.firstNotUndefined<QueryRecordValueType>(
                record[index]?.stringValue,
                record[index]?.doubleValue,
                record[index]?.longValue,
                record[index]?.booleanValue,
                record[index]?.blobValue,
              );
            }
          });

          items.push(newRecord as T);
        });
        nextToken = response.NextToken;
      } while (nextToken);
    } catch (error) {
      console.log(`GetStatementResult has failed`, error);
      return [];
    }

    return items;
  }

  /**
   * Assumes a role in the DataPlatform AWS account and creates a
   * RedshiftDataClient with the credentials from the assumed role.
   *
   * @throws {Error} if failed to assume role
   */
  private async createClientWithAssumedRole() {
    const stsClient = new STSClient({ region: "us-east-1" });
    const { Credentials } = await stsClient.send(
      new AssumeRoleCommand({
        RoleArn: env.AWS_ASSUME_ROLE_ARN,
        RoleSessionName: `nucleus-${env.NODE_ENV}`,
      }),
    );

    if (!Credentials) {
      throw new Error("Failed to assume role");
    }

    this.client = new RedshiftDataClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: Credentials.AccessKeyId!,
        secretAccessKey: Credentials.SecretAccessKey!,
        sessionToken: Credentials.SessionToken,
      },
    });
  }

  private async initializeClient() {
    if (
      this.client === null ||
      this.dateRoleAssumed === null ||
      new Date().getTime() - this.dateRoleAssumed.getTime() > 3600000 // 1h
    ) {
      this.dateRoleAssumed = new Date();
      await this.createClientWithAssumedRole();
    }
    return this.client!;
  }

  private async sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  // Find the first non-undefined value among arguments
  private firstNotUndefined<T>(...args: T[]): T | undefined {
    return args.find((arg) => arg !== undefined);
  }
}
