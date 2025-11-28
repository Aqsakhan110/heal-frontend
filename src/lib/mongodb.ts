// // src/lib/mongodb.ts
// import { MongoClient, Db } from "mongodb";
// import path from "path";

// // Get MongoDB URI & DB name from environment variables
// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB || "heal";

// if (!uri) {
//   throw new Error("Missing MONGODB_URI in .env.local");
// }

// // Path to the downloaded CA bundle
// const caFilePath = path.join(process.cwd(), "certs", "global-bundle.pem");

// // Cached connection variables (for Next.js hot reloads)
// let cachedClient: MongoClient | null = null;
// let cachedDb: Db | null = null;

// /**
//  * Connect to MongoDB Atlas with caching for Next.js
//  */
// export async function connectToDatabase(): Promise<Db> {
//   // Return cached connection if available
//   if (cachedClient && cachedDb) {
//     return cachedDb;
//   }

//   // Create new MongoClient
//   const client = new MongoClient(uri!, {
//     serverApi: {
//       version: "1",
//       strict: true,
//       deprecationErrors: true,
//     },
//     tls: true,                 // enable TLS
//     tlsCAFile: caFilePath,     // specify CA bundle
//   });

//   // Connect to MongoDB Atlas
//   await client.connect();

//   // Select database
//   const db = client.db(dbName);

//   // Cache for future requests
//   cachedClient = client;
//   cachedDb = db;

//   return db;
// }





// src/lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

// Get MongoDB URI & DB name from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "heal";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

// Cached connection variables (for Next.js hot reloads)
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB Atlas with caching for Next.js
 */
export async function connectToDatabase(): Promise<Db> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  // Create new MongoClient WITHOUT tlsCAFile
  const client = new MongoClient(uri!, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true, // IMPORTANT FIX FOR WINDOWS LOCAL
  });

  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}
