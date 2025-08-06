import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    // First check if user exists in local Convex database
    const localUser = await ctx.db
      .query("userBase")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    
    if (localUser) {
      return localUser;
    }

    // If not found locally, we'll need to sync from MongoDB
    // This will be handled by the authentication flow
    return null;
  },
});

export const getCurrentUserData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    
    const authUser = await ctx.db.get(userId);
    if (!authUser) {
      return null;
    }

    // Extract username from email format (username@lawtown.local)
    const username = authUser.email?.split('@')[0] || authUser.name || "";

    // Find the corresponding userBase record
    const userData = await ctx.db
      .query("userBase")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();
    
    return userData;
  },
});

export const syncUserFromMongoDB = mutation({
  args: {
    userData: v.object({
      guild: v.string(),
      user: v.string(),
      username: v.string(),
      password: v.string(),
      c1: v.object({
        cash: v.number(),
        bank: v.number(),
        status: v.boolean(),
        timeLeft: v.number(),
        id: v.optional(v.any()),
        inv: v.array(v.any()),
        clamped: v.boolean(),
        clamp_before: v.boolean(),
        jail: v.number(),
        builds: v.array(v.any()),
        cars: v.array(v.any()),
        police_points: v.array(v.object({
          name: v.string(),
          value: v.number()
        }))
      }),
      c2: v.object({
        cash: v.number(),
        bank: v.number(),
        status: v.boolean(),
        timeLeft: v.number(),
        id: v.optional(v.any()),
        inv: v.array(v.any()),
        clamped: v.boolean(),
        clamp_before: v.boolean(),
        jail: v.number(),
        builds: v.array(v.any()),
        cars: v.array(v.any()),
        police_points: v.array(v.object({
          name: v.string(),
          value: v.number()
        }))
      }),
      points: v.object({
        id: v.number(),
        gmc: v.number(),
        start_game: v.number(),
        join_game: v.number(),
        take_ticket: v.number(),
        take_report: v.number(),
        others: v.number(),
        tf3el: v.number()
      })
    })
  },
  handler: async (ctx, args) => {
    // Check if user already exists in Convex
    const existingUser = await ctx.db
      .query("userBase")
      .withIndex("by_username", (q) => q.eq("username", args.userData.username))
      .first();

    if (existingUser) {
      // Update existing user with fresh MongoDB data
      await ctx.db.patch(existingUser._id, args.userData);
      return existingUser._id;
    } else {
      // Create new user record
      return await ctx.db.insert("userBase", args.userData);
    }
  },
});

export const createUserData = mutation({
  args: {
    username: v.string(),
    user: v.string(),
    guild: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const defaultPolicePoints = [
      { name: "login", value: 0 },
      { name: "claim_report", value: 0 },
      { name: "status", value: 0 },
      { name: "others", value: 0 }
    ];

    const defaultCharacterData = {
      cash: 0,
      bank: 0,
      status: false,
      timeLeft: 0,
      id: null,
      inv: [],
      clamped: false,
      clamp_before: false,
      jail: 0,
      builds: [],
      cars: [],
      police_points: defaultPolicePoints
    };

    return await ctx.db.insert("userBase", {
      guild: args.guild || "",
      user: args.user,
      username: args.username,
      password: "", // Password handled by Convex Auth
      c1: defaultCharacterData,
      c2: defaultCharacterData,
      points: {
        id: 0,
        gmc: 0,
        start_game: 0,
        join_game: 0,
        take_ticket: 0,
        take_report: 0,
        others: 0,
        tf3el: 0
      }
    });
  },
});

export const updateCharacterData = mutation({
  args: {
    character: v.union(v.literal("c1"), v.literal("c2")),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const authUser = await ctx.db.get(userId);
    if (!authUser) {
      throw new Error("User not found");
    }

    // Extract username from email format
    const username = authUser.email?.split('@')[0] || authUser.name || "";

    const userData = await ctx.db
      .query("userBase")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();

    if (!userData) {
      throw new Error("User data not found");
    }

    const updateData = {
      [args.character]: {
        ...userData[args.character],
        [args.field]: args.value
      }
    };

    await ctx.db.patch(userData._id, updateData);
  },
});
