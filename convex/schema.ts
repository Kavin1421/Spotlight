import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(), //kavinkumar
    // username is unique, so we can use it to find a user
    fullname: v.string(), // Kavin Kumar
    // fullname is not unique, so we can use it to display the user's name
    email: v.string(),
    // email is unique, so we can use it to find a user
    bio: v.optional(v.string()),
    // bio is optional, so we can use it to display the user's bio
    image: v.string(),
    // image is the URL of the user's profile picture
    followers: v.number(),
    // followers is the number of followers the user has
    following: v.number(),
    // following is the number of users the user is following
    posts: v.number(),
    // posts is the number of posts the user has made
    clerkId: v.string(),
    // clerkId is the unique identifier for the user in Clerk
  }).index("by_clerk_id", ["clerkId"]),

  posts: defineTable({
    userId: v.id("users"),
    // userId is the id of the user who made the post
    imageUrl: v.string(),
    // imageUrl is the URL of the post's image
    storageId: v.id("_storage"), 
    // will be needed when we want to delete a post
    caption: v.optional(v.string()),
    // caption is the text of the post
    likes: v.number(),
    // likes is the number of likes the post has
    comments: v.number(),
    // comments is the number of comments the post has
  }).index("by_user", ["userId"]),

  likes: defineTable({
    userId: v.id("users"),
    // userId is the id of the user who liked the post
    postId: v.id("posts"),
    // postId is the id of the post that was liked
  })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  comments: defineTable({
    userId: v.id("users"),
    // userId is the id of the user who made the comment
    postId: v.id("posts"),
    // postId is the id of the post that was commented on
    content: v.string(),
    // content is the text of the comment
  }).index("by_post", ["postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    // followerId is the id of the user who is following another user
    followingId: v.id("users"),
    // followingId is the id of the user who is being followed
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  notifications: defineTable({
    receiverId: v.id("users"),
    // receiverId is the id of the user who will receive the notification
    senderId: v.id("users"),
    // senderId is the id of the user who triggered the notification
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
    // type is the type of notification (like, comment, follow)
    postId: v.optional(v.id("posts")),
    // postId is the id of the post that triggered the notification, if applicable
    commentId: v.optional(v.id("comments")),
    // commentId is the id of the comment that triggered the notification, if applicable
  })
    .index("by_receiver", ["receiverId"])
    .index("by_post", ["postId"]), 

  bookmarks: defineTable({
    userId: v.id("users"),
    // userId is the id of the user who bookmarked the post
    postId: v.id("posts"),
    // postId is the id of the post that was bookmarked
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),
});
