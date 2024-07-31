import {
  AggregationCursor,
  Binary,
  Collection as MongoCollection,
  CreateIndexesOptions,
  Db,
  Filter,
  IndexDirection,
  IndexSpecification,
  InsertManyResult,
  InsertOneResult,
  MongoClient,
  ObjectId,
  ServerApiVersion,
} from "mongodb";
import { Attribute } from "types/modules";

import { AuthProvider } from "./auth";

const config = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  cluster: process.env.MONGO_CLUSTER,
  host: process.env.MONGO_HOST,
};
const missing = Object.keys(config).filter(
  (k) => !config[k as keyof typeof config]
);

if (missing.length) {
  throw new Error(`Missing Mongodb env variables: ${missing.join(", ")}`);
}

const uri = `mongodb+srv://${config.user}:${config.pass}@${config.cluster}.${config.host}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.NODE_ENV}`;

export type Documents = {
  users: UserModel;
  newUsers: NewUserModel;
  socialUsers: SocialUserModel;
  posts: PostModel;
  comments: CommentModel;
};

export type Collection = Exclude<keyof Documents, "newUsers" & "socialUsers">;

export type UserModel = {
  username: string;
  password: string;
  source: AuthProvider | "form";
};
export type NewUserModel = UserModel & { email: string };
export type SocialUserModel = Omit<UserModel, "password">;

export interface PostModel {
  meta: Pick<Attribute, "source" | "url"> & {
    date: Date;
    title: string;
    description: string;
    slug: string;
  };
  content: Binary;
}

export interface CommentModel {
  user: ObjectId;
  post: ObjectId;
  content: string;
  date: Date;
}

export interface Comment extends Pick<CommentModel, "content"> {
  user: UserModel["username"];
  date: string;
}

type WithJoin<
  T extends Collection,
  L extends Exclude<Collection, T>
> = Documents[T] & {
  [key in Exclude<Collection, T> as `${key}_model`]: Documents[L];
};

type MappedDocument<T extends keyof Documents> = T extends "newUsers"
  ? "users"
  : T extends "socialUsers"
  ? "users"
  : T;

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

  private getCollection<T extends Collection>(
    collection: Collection
  ): MongoCollection<Documents[T]> {
    return this.#db.collection(collection);
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

  async createOne<T extends keyof Documents>(
    collection: Collection,
    doc: Documents[T]
  ): Promise<InsertOneResult> {
    return this.getCollection(collection).insertOne(doc);
  }
  async createMany<T extends keyof Documents>(
    collection: Collection,
    doc: Array<Documents[T]>
  ): Promise<InsertManyResult> {
    return this.getCollection(collection).insertMany(doc);
  }

  async createIndex<T extends keyof Documents>(
    collection: MappedDocument<T>,
    indexSpec: Partial<Record<keyof Documents[T], IndexDirection>>,
    options?: CreateIndexesOptions
  ) {
    return this.getCollection(collection).createIndex(
      indexSpec as IndexSpecification,
      { ...options, unique: true }
    );
  }

  async findOne<T extends Collection>(
    collection: T,
    filter: Filter<Documents[T]>
  ) {
    return this.getCollection<T>(collection).findOne(filter);
  }

  async findMany<T extends Collection>(
    collection: T,
    filter: Filter<Documents[T]>
  ) {
    return this.getCollection<T>(collection).find(filter);
  }

  async findAll<T extends Collection>(collection: T) {
    return this.getCollection<T>(collection).find();
  }

  async findOrCreateOne<T extends keyof Documents>(
    collection: Collection,
    filter: Filter<Documents[T]>,
    doc: Documents[T]
  ) {
    return this.getCollection<T>(collection).findOneAndUpdate(
      filter,
      { $set: doc },
      { upsert: true, returnDocument: "after" }
    );
  }

  async count<T extends Collection>(
    collection: T,
    filter?: Filter<Documents[T]>
  ) {
    return this.getCollection<T>(collection).countDocuments(filter);
  }

  async aggregate<T extends Collection, L extends Exclude<Collection, T>>(
    collection: T,
    match: Filter<Documents[T]>,
    lookup: L
  ): Promise<AggregationCursor<WithJoin<T, L>>> {
    const mapKey = `${lookup}_model`;
    const field = lookup.replace(/s$/, "");

    return this.#db.collection<Documents[T]>(collection).aggregate([
      { $match: match },
      {
        $lookup: {
          from: lookup,
          localField: field,
          foreignField: "_id",
          as: mapKey,
        },
      },
      { $unwind: "$" + mapKey },
    ]);
  }
}

const singleton = Object.freeze(new DB());
export default singleton;
