// sqlite object put to s3 and
import { DB } from "https://deno.land/x/sqlite/mod.ts";

import { getObject, putObject } from "./storage.ts";

class Message {
    ImageUrl: string
    Name: string
    Message: string
    constructor(imageUrl: string, name: string, message: string) {
        this.ImageUrl = imageUrl;
        this.Name = name;
        this.Message = message;
    }
}

const db  = async () => {
    if (Deno.env.get("ENV") === "local") {
        // use lcaol sqlite db 
        const db = new DB("mapper.local.db");
        return db;
    } else {
        const object = await getObject("db/mapper.db");
        // please save to /tmp/mapper.db and convert to Uint8Array
        if (!object.Body) {
            throw new Error("Object body is undefined");
        }
        await Deno.writeFile("/tmp/mapper.db", new Uint8Array(await object.Body.transformToByteArray()));
        const db = new DB("/tmp/mapper.db");
        return db;
    }
}


export async function selectMessages(): Promise<Message[]> {
    const database = await db();
    const messages: Message[] = [];

    for (const [imageUrl, name, message] of database.query("SELECT ImageUrl, Name, Message FROM messages")) {
        messages.push(new Message(String(imageUrl), String(name), String(message)));
    }
    
    return messages;
}

export async function insertMessage(message: Message): Promise<void> {
    const database = await db();
    database.query("INSERT INTO messages (ImageUrl, Name, Message) VALUES (?, ?, ?)", 
 [message.ImageUrl, message.Name, message.Message]);
    
    if (Deno.env.get("ENV") !== "local") {
        await syncDbToS3();
    }
}

async function syncDbToS3(): Promise<void> {
    const data = await Deno.readFile("/tmp/mapper.db");
    await putObject("db/mapper.db", data);
}
