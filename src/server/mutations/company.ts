import { client } from "@/api/client";

export const downloadDocuments = {
  key: "documents-zipped",
  mutation: async (keys: string[], name: string): Promise<void> => {
    const response = await fetch(`/api/case/${keys.join(",")}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name }),
    });
    if (!response.body) return;

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("done");
        break;
      }
      chunks.push(value);

      received += value.length;
      console.log(`${received} bytes`);
    }

    const blob = new Blob(chunks);

    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");

    element.href = url;
    element.download = name;

    const handleOnDownload = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        element.removeEventListener("click", handleOnDownload);
      }, 150);
    };

    element.addEventListener("click", handleOnDownload, false);
    element.click();
  },
} as const;

export const updateTCPA = {
  key: "update-tcpa",
  mutation: async (
    phone: string,
    tcpa: boolean,
  ): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>("/dashboard/tcpa", {
      phone,
      tcpa,
    });
    return res.data;
  },
} as const;
