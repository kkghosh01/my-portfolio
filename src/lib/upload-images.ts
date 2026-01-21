import { Id } from "../../convex/_generated/dataModel";

export async function uploadImages(
  files: File[],
  generateUploadUrl: () => Promise<string>,
): Promise<Id<"_storage">[]> {
  const ids: Id<"_storage">[] = [];

  for (const file of files) {
    const uploadUrl = await generateUploadUrl();

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await res.json();

    ids.push(storageId as Id<"_storage">);
  }

  return ids;
}
