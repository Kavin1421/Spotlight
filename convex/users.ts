import { v } from "convex/values";
import { mutation, MutationCtx, QueryCtx } from "./_generated/server";

// Create a new user with the given details
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user already exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return;
    }

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId, // Clerk ID for user identification
      followers: 0, // Initial followers count
      following: 0, // Initial following count
      posts: 0, // Initial posts count
    });
  },
});


export async function getAuthenticatedUser(ctx : QueryCtx | MutationCtx){
   const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }
    return currentUser;
}