import { Hono } from "hono";


const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/register", async (c) => {
  const body = await c.req.json();
  console.log(body);
  return c.json({ ok: true });
});


Deno.serve(app.fetch);
