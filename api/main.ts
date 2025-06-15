import { Hono } from "hono";
import { insertMessage, selectMessages } from "./service/store.ts";
import { putObject } from "./service/storage.ts";
import { randomUUID } from "node:crypto";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/register", async (c) => {
  // Check if the request is multipart form data
  const contentType = c.req.header("content-type") || "";
  
  if (contentType.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    const name = formData.get("name") as string || "";
    const message = formData.get("message") as string || "";
    const imageFile = formData.get("image") as File | null;
    
    let imageUrl = "";
    
    // If image is included, upload it to S3
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop() || "jpg";
      const fileName = `images/${randomUUID()}.${fileExt}`;
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      // Upload to S3
      await putObject(fileName, fileData, imageFile.type);
      
      // Generate the image URL
      imageUrl = fileName;
    }
    
    // Insert message with image URL
    await insertMessage({
      ImageUrl: imageUrl,
      Name: name,
      Message: message
    });
    
    return c.json({ ok: true, imageUrl });
  } else {
    // Handle regular JSON requests as before
    const body = await c.req.json();
    console.log(body);
    await insertMessage(body);
    return c.json({ ok: true });
  }
});

app.get("/api/v1/messages", async (c) => {
  const offset = Number(c.req.query("offset"));
  const limit = Number(c.req.query("limit"));
  const messages = await selectMessages(
    isNaN(offset) ? 10 : offset,
    isNaN(limit) ? 100 : limit
  );
  return c.json(messages);
});


Deno.serve(app.fetch);
