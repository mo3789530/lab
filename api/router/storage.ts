// Example usage in main.ts
import { Hono } from "hono";
import { listObjects } from "../service/storage.ts"

const app = new Hono();


app.get("/storage/objects", async (c) => {
  try {
    const objects = await listObjects();
    return c.json({ success: true, objects });
  } catch (error) {
    console.error("Failed to list S3 objects:", error);
    return c.json({ success: false, error: "Failed to retrieve objects" }, 500);
  }
});


