import {
  Binary,
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

export type Documents = {
  users: UserModel;
  newUser: NewUserModel;
  posts: PostModel;
  comments: CommentModel;
};

export type Collection = Exclude<keyof Documents, "newUser">;

export type UserModel = { username: string; password: string };
export type NewUserModel = UserModel & { email: string };

export type PostModel = {
  meta: Pick<Attribute, "source" | "url"> & {
    date: Date;
    title: string;
    description: string;
    slug: string;
  };
  content: Binary;
};

export type CommentModel = {
  user: ObjectId;
  post: ObjectId;
  content: string;
  date: Date;
};

export type DisplayComment = {
  username: string;
  content: string;
  date: Date;
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

  async findOne<T extends Collection>(
    collection: T,
    filter: Filter<Documents[T]>
  ) {
    return this.#db.collection<Documents[T]>(collection).findOne(filter);
  }

  async findMany<T extends Collection>(
    collection: T,
    filter: Filter<Documents[T]>
  ) {
    return this.#db.collection<Documents[T]>(collection).find(filter);
  }

  async findAll<T extends Collection>(collection: T) {
    return this.#db.collection<Documents[T]>(collection).find();
  }

  async count<T extends Collection>(
    collection: T,
    filter?: Filter<Documents[T]>
  ) {
    return this.#db.collection<Documents[T]>(collection).countDocuments(filter);
  }
}

const singleton = Object.freeze(new DB());
export default singleton;
