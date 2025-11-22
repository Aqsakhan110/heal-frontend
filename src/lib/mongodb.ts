// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI as string;

// if (!uri) {
//   throw new Error("Please add your MongoDB URI to .env.local");
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   if (!(global as any)._mongoClientPromise) {
//     client = new MongoClient(uri);
//     (global as any)._mongoClientPromise = client.connect();
//   }
//   clientPromise = (global as any)._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function connectToDatabase() {
//   const client = await clientPromise;
//   const db = client.db("heal"); // ✅ your DB name
//   return { client, db };
// }


import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (!uri) throw new Error("Missing MONGODB_URI");

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();

  const dbName = "heal"; // <-- your DB name
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
