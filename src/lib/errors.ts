import { type NextApiRequest, type NextApiResponse } from "next";
import { type ResponseError, type ResponseData } from "./types";

function withError(
  fn: (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ResponseError>,
  ) => Promise<void | NextApiResponse>,
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    await fn(req, res).catch((error) => {
      console.error("failed to process request", error);
      res.status(500).json({ error: "Something went wrong..." });
    });
  };
}

export default withError;
