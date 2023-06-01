import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.ak2zyln.mongodb.net/${process.env.DB_DATABASE_DEV}?retryWrites=true&w=majority`;

  const client = await MongoClient.connect(connectionString);

  return client;
}

export default connectToDatabase;
