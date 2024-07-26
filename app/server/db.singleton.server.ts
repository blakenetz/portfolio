import {
  AggregationCursor,
  Binary,
  Collection as MongoCollection,
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
