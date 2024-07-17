import { MongoClient, ServerApiVersion } from "mongodb";

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;

const uri = `mongodb+srv://${user}:${pass}@${cluster}.eqg93nd.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.NODE_ENV}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
