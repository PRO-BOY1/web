import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }
    
    const authUser = await ctx.db.get(userId);
    if (!authUser) {
      return false;
    }

    // Extract username from email format
    const username = authUser.email?.split('@')[0] || authUser.name || "";
    return username === "adminuser";
  },
});

// Get all server updates
export const getServerUpdates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("serverUpdates")
      .order("desc")
      .take(10);
  },
});

// Add server update (admin only)
export const addServerUpdate = mutation({
  args: {
    version: v.string(),
    description: v.string(),
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
    
    if (username !== "adminuser") {
      throw new Error("Only administrators can add server updates");
    }

    return await ctx.db.insert("serverUpdates", {
      version: args.version,
      description: args.description,
      addedBy: username,
    });
  },
});

// Get server info
export const getServerInfo = query({
  args: {},
  handler: async (ctx) => {
    const info = await ctx.db.query("serverInfo").collect();
    const infoMap: Record<string, string> = {};
    
    for (const item of info) {
      infoMap[item.key] = item.value;
    }
    
    return {
      discordLink: infoMap.discordLink || "https://discord.gg/lawtown",
      rulesLink: infoMap.rulesLink || "#",
      supportLink: infoMap.supportLink || "#",
      donationLink: infoMap.donationLink || "#",
      currentPlayers: parseInt(infoMap.currentPlayers || "0"),
      maxPlayers: parseInt(infoMap.maxPlayers || "30"),
    };
  },
});

// Update server info (admin only)
export const updateServerInfo = mutation({
  args: {
    key: v.string(),
    value: v.string(),
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
    
    if (username !== "adminuser") {
      throw new Error("Only administrators can update server info");
    }

    const existing = await ctx.db
      .query("serverInfo")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("serverInfo", {
        key: args.key,
        value: args.value,
      });
    }
  },
});
