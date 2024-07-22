import {
  Db,
  Filter,
  InsertManyResult,
  InsertOneResult,
  MongoClient,
  ObjectId,
  ServerApiVersion,
} from "mongodb";
import { Attribute } from "types/modules";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.eqg93nd.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.NODE_ENV}`;

type Documents = {
  users: User;
  newUser: NewUser;
  posts: Post;
  comments: Comment;
};

type Collection = Exclude<keyof Documents, "newUser">;

type User = { username: string; password: string };
type NewUser = User & { email: string };

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

  async create<T extends keyof Documents>(
    collection: Collection,
    doc: Documents[T]
  ): Promise<InsertOneResult> {
    return this.#db.collection(collection).insertOne(doc);
  }
  async createMany<T extends keyof Documents>(
    collection: Collection,
    doc: Array<Documents[T]>
  ): Promise<InsertManyResult> {
    return this.#db.collection(collection).insertMany(doc);
  }

  async findOne<T extends keyof Documents>(
    collection: T,
    doc: Filter<Documents[T]>
  ) {
    return this.#db.collection<Documents[T]>(collection).find(doc);
  }
}

const singleton = Object.freeze(new DB());
export default singleton;
