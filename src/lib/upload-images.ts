import { Id } from "../../convex/_generated/dataModel";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImages(
  files: File[],
  generateUploadUrl: () => Promise<string>,
): Promise<Id<"_storage">[]> {
  if (!files.length) return [];

  const errors: string[] = [];

  files.forEach((file, index) => {
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File ${index + 1}: ${file.name} exceeds 2MB limit`);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(
        `File ${index + 1}: ${file.name} must be JPEG, PNG, or WebP`,
      );
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  const uploadPromises = files.map(async (file) => {
    const uploadUrl = await generateUploadUrl();

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Upload failed for file: ${file.name}`);
    }

    const { storageId } = await res.json();
    return storageId as Id<"_storage">;
  });

  return Promise.all(uploadPromises);
}
