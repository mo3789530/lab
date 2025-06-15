// sqlite object put to s3 and
import { DB } from "https://deno.land/x/sqlite/mod.ts";

import { getObject, putObject } from "./storage.ts";
import { randomUUID, UUID } from "node:crypto";

class Message {
  Id?: UUID;
  ImageUrl: string;
  Name: string;
  Message: string;
  constructor(id: UUID | undefined = undefined, imageUrl: string, name: string, message: string) {
    this.Id = id;
    this.ImageUrl = imageUrl;
    this.Name = name;
    this.Message = message;
  }
}

const db = async () => {
  if (Deno.env.get("ENV") ?? "local" === "local") {
    // use lcaol sqlite db
    const db = new DB("mapper.local.db");
    return db;
  } else {
    const object = await getObject("db/mapper.db");
    // please save to /tmp/mapper.db and convert to Uint8Array
    if (!object.Body) {
      throw new Error("Object body is undefined");
    }
    await Deno.writeFile(
      "/tmp/mapper.db",
      new Uint8Array(await object.Body.transformToByteArray()),
    );
    const db = new DB("/tmp/mapper.db");
    return db;
  }
};

export async function selectMessages(
  offset: number,
  limit: number,
): Promise<Message[]> {
  const database = await db();
  const messages: Message[] = [];

  const query = "SELECT ImageUrl, Name, Message FROM maps LIMIT ? OFFSET ?";
  for (
    const [id, imageUrl, name, message] of database.query(query, [limit, offset])
  ) {
    messages.push(new Message(id as UUID, String(imageUrl), String(name), String(message)));
  }

  return messages;
}

export async function insertMessage(message: Message): Promise<void> {
  const database = await db();
  const id = randomUUID();
  database.query(
    "INSERT INTO maps (id, imageUrl, name, message, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
    [id, message.ImageUrl, message.Name, message.Message],
  );

  if (Deno.env.get("ENV") !== "local") {
    await syncDbToS3();
  }
}

async function syncDbToS3(): Promise<void> {
  const data = await Deno.readFile("/tmp/mapper.db");
  await putObject("db/mapper.db", data);
}
