import {
  Db,
  InsertManyResult,
  InsertOneResult,
  MongoClient,
  ObjectId,
  ServerApiVersion,
} from "mongodb";
import { Attribute } from "types/modules";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.eqg93nd.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.NODE_ENV}`;

type Collections = {
  users: User;
  posts: Post;
  comments: Comment;
};

type Collection = keyof Collections;

type User = {
  username: string;
  password: string;
};

type Post = {
  meta: Pick<Attribute, "source" | "url"> & { date: Date };
  content: string;
};

type Comment = {
  user: ObjectId;
  content: string;
};

class DB {
  #client: MongoClient;
  #db: Db;

  constructor() {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    client.connect();

    this.#client = client;
    this.#db = client.db();
  }

  async destroy() {
    await Promise.all([
      this.#client.db().dropCollection("users"),
      this.#client.db().dropCollection("posts"),
      this.#client.db().dropCollection("comments"),
    ]);
  }

  close() {
    this.#client.close();
  }

  async createCollect(name: Collection) {
    return this.#db.createCollection(name);
  }

  async create<T extends Collection>(
    collection: T,
    doc: Collections[T]
  ): Promise<InsertOneResult> {
    return this.#db.collection(collection).insertOne(doc);
  }
  async createMany<T extends Collection>(
    collection: T,
    doc: Array<Collections[T]>
  ): Promise<InsertManyResult> {
    return this.#db.collection(collection).insertMany(doc);
  }
}

const singleton = Object.freeze(new DB());
export default singleton;
