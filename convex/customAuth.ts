"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://lawtownbank:dEEFew7pBkBcSSsu@test.dzq966q.mongodb.net/";

export const signInWithUsername = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for admin credentials first
    if (args.username === "adminuser" && args.password === "12@user") {
      console.log("Admin login detected");
      return {
        guild: "Law Town RP",
        user: "Administrator",
        username: "adminuser",
        password: "12@user",
        c1: {
          cash: 999999,
          bank: 999999,
          status: true,
          timeLeft: 0,
          id: null,
          inv: [],
          clamped: false,
          clamp_before: false,
          jail: 0,
          builds: [],
          cars: [],
          police_points: [
            { name: "login", value: 999 },
            { name: "claim_report", value: 999 },
            { name: "status", value: 999 },
            { name: "others", value: 999 }
          ]
        },
        c2: {
          cash: 999999,
          bank: 999999,
          status: true,
          timeLeft: 0,
          id: null,
          inv: [],
          clamped: false,
          clamp_before: false,
          jail: 0,
          builds: [],
          cars: [],
          police_points: [
            { name: "login", value: 999 },
            { name: "claim_report", value: 999 },
            { name: "status", value: 999 },
            { name: "others", value: 999 }
          ]
        },
        points: {
          id: 999,
          gmc: 999,
          start_game: 999,
          join_game: 999,
          take_ticket: 999,
          take_report: 999,
          others: 999,
          tf3el: 999
        }
      };
    }

    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("userbases");
      
      // Find user in MongoDB by username
      console.log("MongoDB lookup for username:", args.username);
      const mongoUser = await collection.findOne({ username: args.username });
      console.log("Found user:", !!mongoUser);
      console.log("User data:", mongoUser ? { username: mongoUser.username, hasPassword: !!mongoUser.password } : null);
      
      if (!mongoUser) {
        console.log("User not found in MongoDB");
        throw new Error("Invalid username or password");
      }

      // Check if password matches
      console.log("Provided password:", args.password);
      console.log("Stored password:", mongoUser.password);
      console.log("Password match:", mongoUser.password === args.password);
      if (mongoUser.password !== args.password) {
        throw new Error("Invalid username or password");
      }

      // Transform MongoDB data to our expected format
      const userData = {
        guild: mongoUser.guild || "",
        user: mongoUser.user || "",
        username: mongoUser.username,
        password: mongoUser.password || "",
        c1: {
          cash: mongoUser.c1?.cash || 0,
          bank: mongoUser.c1?.bank || 0,
          status: mongoUser.c1?.status || false,
          timeLeft: mongoUser.c1?.timeLeft || 0,
          id: mongoUser.c1?.id || null,
          inv: mongoUser.c1?.inv || [],
          clamped: mongoUser.c1?.clamped || false,
          clamp_before: mongoUser.c1?.clamp_before || false,
          jail: mongoUser.c1?.jail || 0,
          builds: mongoUser.c1?.builds || [],
          cars: mongoUser.c1?.cars || [],
          police_points: mongoUser.c1?.police_points || [
            { name: "login", value: 0 },
            { name: "claim_report", value: 0 },
            { name: "status", value: 0 },
            { name: "others", value: 0 }
          ]
        },
        c2: {
          cash: mongoUser.c2?.cash || 0,
          bank: mongoUser.c2?.bank || 0,
          status: mongoUser.c2?.status || false,
          timeLeft: mongoUser.c2?.timeLeft || 0,
          id: mongoUser.c2?.id || null,
          inv: mongoUser.c2?.inv || [],
          clamped: mongoUser.c2?.clamped || false,
          clamp_before: mongoUser.c2?.clamp_before || false,
          jail: mongoUser.c2?.jail || 0,
          builds: mongoUser.c2?.builds || [],
          cars: mongoUser.c2?.cars || [],
          police_points: mongoUser.c2?.police_points || [
            { name: "login", value: 0 },
            { name: "claim_report", value: 0 },
            { name: "status", value: 0 },
            { name: "others", value: 0 }
          ]
        },
        points: {
          id: mongoUser.points?.id || 0,
          gmc: mongoUser.points?.gmc || 0,
          start_game: mongoUser.points?.start_game || 0,
          join_game: mongoUser.points?.join_game || 0,
          take_ticket: mongoUser.points?.take_ticket || 0,
          take_report: mongoUser.points?.take_report || 0,
          others: mongoUser.points?.others || 0,
          tf3el: mongoUser.points?.tf3el || 0
        }
      };

      return userData;
    } catch (error) {
      console.error("MongoDB authentication error:", error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await client.close();
    }
  },
});

export const getUserFromMongoDB = action({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("userbases");
      
      const mongoUser = await collection.findOne({ username: args.username });
      
      if (!mongoUser) {
        return null;
      }

      // Transform MongoDB data to our expected format
      const userData = {
        guild: mongoUser.guild || "",
        user: mongoUser.user || "",
        username: mongoUser.username,
        password: mongoUser.password || "",
        c1: {
          cash: mongoUser.c1?.cash || 0,
          bank: mongoUser.c1?.bank || 0,
          status: mongoUser.c1?.status || false,
          timeLeft: mongoUser.c1?.timeLeft || 0,
          id: mongoUser.c1?.id || null,
          inv: mongoUser.c1?.inv || [],
          clamped: mongoUser.c1?.clamped || false,
          clamp_before: mongoUser.c1?.clamp_before || false,
          jail: mongoUser.c1?.jail || 0,
          builds: mongoUser.c1?.builds || [],
          cars: mongoUser.c1?.cars || [],
          police_points: mongoUser.c1?.police_points || [
            { name: "login", value: 0 },
            { name: "claim_report", value: 0 },
            { name: "status", value: 0 },
            { name: "others", value: 0 }
          ]
        },
        c2: {
          cash: mongoUser.c2?.cash || 0,
          bank: mongoUser.c2?.bank || 0,
          status: mongoUser.c2?.status || false,
          timeLeft: mongoUser.c2?.timeLeft || 0,
          id: mongoUser.c2?.id || null,
          inv: mongoUser.c2?.inv || [],
          clamped: mongoUser.c2?.clamped || false,
          clamp_before: mongoUser.c2?.clamp_before || false,
          jail: mongoUser.c2?.jail || 0,
          builds: mongoUser.c2?.builds || [],
          cars: mongoUser.c2?.cars || [],
          police_points: mongoUser.c2?.police_points || [
            { name: "login", value: 0 },
            { name: "claim_report", value: 0 },
            { name: "status", value: 0 },
            { name: "others", value: 0 }
          ]
        },
        points: {
          id: mongoUser.points?.id || 0,
          gmc: mongoUser.points?.gmc || 0,
          start_game: mongoUser.points?.start_game || 0,
          join_game: mongoUser.points?.join_game || 0,
          take_ticket: mongoUser.points?.take_ticket || 0,
          take_report: mongoUser.points?.take_report || 0,
          others: mongoUser.points?.others || 0,
          tf3el: mongoUser.points?.tf3el || 0
        }
      };

      return userData;
    } catch (error) {
      console.error("Error fetching user from MongoDB:", error);
      return null;
    } finally {
      await client.close();
    }
  },
});
