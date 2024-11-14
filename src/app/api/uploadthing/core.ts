import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 3 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload success", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
