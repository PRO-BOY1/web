"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://lawtownbank:dEEFew7pBkBcSSsu@test.dzq966q.mongodb.net/";

export const testMongoConnection = action({
  args: {},
  handler: async (ctx) => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("userbases");
      
      // List all collections first
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      // Test userbases collection
      const userCount = await collection.countDocuments();
      const sampleUser = await collection.findOne({});
      
      // Get first 5 usernames for debugging (filter out undefined/null usernames)
      const users = await collection.find({ username: { $exists: true, $ne: null } }, { projection: { username: 1, _id: 0 } }).limit(5).toArray();
      const usernames = users.map(u => u.username).filter(username => username && typeof username === 'string');
      
      return {
        connected: true,
        databaseName: db.databaseName,
        allCollections: collectionNames,
        userbasesCount: userCount,
        sampleUsername: sampleUser?.username || "none",
        hasPassword: !!sampleUser?.password,
        sampleUsernames: usernames
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      await client.close();
    }
  },
});

export const syncUserFromMongoDB = action({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db(); // Uses default database
      const collection = db.collection("userbases"); // Adjust collection name as needed
      
      const mongoUser = await collection.findOne({ username: args.username });
      
      if (!mongoUser) {
        throw new Error("User not found in MongoDB");
      }

      // Transform MongoDB data to Convex format
      const convexUserData = {
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

      return convexUserData;
    } catch (error) {
      console.error("Error syncing from MongoDB:", error);
      throw new Error("Failed to sync user data from MongoDB");
    } finally {
      await client.close();
    }
  },
});

export const syncAllUsersFromMongoDB = action({
  args: {},
  handler: async (ctx) => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("userbases");
      
      const mongoUsers = await collection.find({}).toArray();
      const syncedUsers = [];

      for (const mongoUser of mongoUsers) {
        const convexUserData = {
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

        syncedUsers.push(convexUserData);
      }

      return { count: syncedUsers.length, users: syncedUsers };
    } catch (error) {
      console.error("Error syncing from MongoDB:", error);
      throw new Error("Failed to sync users from MongoDB");
    } finally {
      await client.close();
    }
  },
});

export const getAdminDetails = action({
  args: {},
  handler: async (ctx) => {
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("userbases");
      
      const adminUser = await collection.findOne({ username: "admin" });
      
      if (!adminUser) {
        return { found: false };
      }
      
      return {
        found: true,
        username: adminUser.username,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length || 0
      };
    } catch (error) {
      return {
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      await client.close();
    }
  },
});
