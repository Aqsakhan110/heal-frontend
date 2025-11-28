import { MongoClient } from "mongodb";

const uri = "mongodb+srv://aqsakhan9849_db_user:9Nve3x5QbdofqgMf@cluster0.89fpzgx.mongodb.net/heal?retryWrites=true&w=majority";

async function testMongoConnection() {
  // 🔥 Fix TLS issues on Windows
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Atlas sometimes works better with this on Windows
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    const db = client.db("heal");

    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const sample = await db.collection("medicines").find().limit(5).toArray();
    console.log("Sample data:", sample);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  } finally {
    await client.close();
  }
}

testMongoConnection();
