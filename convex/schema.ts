import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userBase: defineTable({
    guild: v.optional(v.string()),
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
    .index("by_username", ["username"])
    .index("by_user", ["user"]),
  
  serverUpdates: defineTable({
    version: v.string(),
    description: v.string(),
    addedBy: v.string(),
  }),
  
  serverInfo: defineTable({
    key: v.string(),
    value: v.string(),
  })
    .index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
