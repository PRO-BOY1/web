import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultPolicePoints = [
      { name: "login", value: 0 },
      { name: "claim_report", value: 0 },
      { name: "status", value: 0 },
      { name: "others", value: 0 }
    ];

    const defaultCharacterData = {
      cash: 5000,
      bank: 10000,
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
      guild: "Law Town RP",
      user: "testuser",
      username: "testuser",
      password: "password123",
      c1: defaultCharacterData,
      c2: defaultCharacterData,
      points: {
        id: 1,
        gmc: 100,
        start_game: 50,
        join_game: 25,
        take_ticket: 10,
        take_report: 15,
        others: 5,
        tf3el: 0
      }
    });
  },
});

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("userBase").collect();
  },
});
