import { type NextApiRequest, type NextApiResponse } from "next";
import { type KeyProps, counter, objects, object } from "@/services/s3";
import withError from "@/lib/errors";
import archiver from "archiver";
import { type Readable } from "stream";
import { type ResponseError, type ResponseData } from "@/lib/types";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) => {
  const { query, method } = req;
  const { keys } = query as KeyProps;
  const queryKeys = keys.filter((item) => item !== "documents");

  switch (method) {
    case "GET": // documents counter
      const count = await counter({ keys: queryKeys });
      const total = Object.values(count).reduce((acc, value) => acc + value, 0);
      res.status(200).json({ message: `${total} case documents` });
      break;

    case "POST": // documents zipper
      const { filename } = req.body as { filename: string };
      const contentDisposition = `attachment; filename=${filename}`;
      res.setHeader("Content-Disposition", contentDisposition);

      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("error", (error) => {
        console.log("Error creating ZIP file:", error);
        res.status(500).json({ error: "Unable to zip file" });
      });

      archive.on("finish", () => {
        console.log("file downloaded");
        res.status(200).json({ message: "file downloaded" });
      });

      archive.pipe(res);

      for (const document of await objects({ keys: queryKeys })) {
        const response = await object(document);
        archive.append(response.Body as Readable, {
          name: document.replace("", "") ?? "",
        });
      }
      await archive.finalize();
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const config = { api: { responseLimit: false } };

export default withError(handler);
