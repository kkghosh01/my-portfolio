import { Id } from "../../convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function incrementView(postId: Id<"posts">) {
  await fetchMutation(api.posts.incrementView, { postId });
}
