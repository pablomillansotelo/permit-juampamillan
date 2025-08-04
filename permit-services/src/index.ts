import { Bao } from "baojs";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Crear cliente con la URL HTTP de Neon
const sql = neon(process.env.DATABASE_URL!);

const app = new Bao();

app.get("/ping", async (ctx) => {
  const result = await sql`SELECT NOW()`;
  return ctx.sendJson({
    message: "Conectado a Neon vía HTTP con Bao.js 😎",
    fecha: result![0]!.now,
  });
});

app.get("/docs", (ctx) => {
  const html = readFileSync(
    join(import.meta.dir, "docs/swagger.html"),
    "utf-8",
  );
  return ctx.sendText(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

app.get("/docs/openapi.json", (ctx) => {
  const json = readFileSync(
    join(import.meta.dir, "docs/openapi.json"),
    "utf-8",
  );
  return ctx.sendText(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
});

app.after((ctx) => {
  const contentType = ctx.res!.headers.get("Content-Type");

  if (
    contentType?.includes("application/json") &&
    !contentType.includes("charset")
  ) {
    ctx.res!.headers.set("Content-Type", "application/json; charset=utf-8");
  }

  ctx.res!.headers.set("X-App-Version", "1.2.3");
  return ctx;
});

app.listen({
  port: 3000,
  hostname: "0.0.0.0",
});
console.log("Servidor Bao.js activo en http://localhost:3000");
