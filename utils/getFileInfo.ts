import { FilePath } from "@/types";

export function getFileInfo(file: FilePath) {
  const uri = file.uri || "";
  const creationTime = file.creationTime;
  const modificationTime = file.modificationTime;

  const filename = uri.split("/").pop() || "";
  const lastDotIndex = filename.lastIndexOf(".");
  const name =
    lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
  const extension =
    lastDotIndex === -1 ? "" : filename.substring(lastDotIndex + 1);

  return {
    name,
    extension,
    fullName: filename,
    creationTime,
    modificationTime,
  };
}
