import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("../mapper.db");
db.execute(`
    CREATE TABLE IF NOT EXISTS maps (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    created_at TEXT,
    updated_at TEXT
    );
`);


const response = await db.query("select * from maps");
console.log(response);
db.close();