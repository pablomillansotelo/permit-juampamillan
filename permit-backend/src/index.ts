import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const app = new Elysia()
  // 🧩 Plugin Swagger
  .use(
    swagger({
      documentation: {
        info: {
          title: "API de Juampa 🚀",
          version: "1.0.0",
          description:
            "Esta es una API documentada con Swagger usando Elysia y Bun.",
        },
      },
    }),
  )
  .get(
    "/saludo/:nombre",
    ({ params }) => ({
      mensaje: `Hola ${params.nombre}`,
    }),
    {
      detail: {
        tags: ["Saludo"],
        summary: "Saludo personalizado",
        description: "Retorna un saludo con el nombre pasado por parámetro",
        responses: {
          200: {
            description: "Respuesta exitosa",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  )
  .get("/", () => "Hello Elysia")
  .get("/test-db", async () => {
    const result = await sql`SELECT NOW()`;
    return {
      message: "Conectado a Neon vía HTTP con Elysia 😎",
      fecha: result![0]!.now,
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
