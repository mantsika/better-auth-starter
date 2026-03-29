import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import { auth } from "./src/lib/auth-server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

async function startServer() {
  const app = express();
  app.set("trust proxy", true);
  const PORT = parseInt(process.env.PORT || "3000");

  const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.length === 0 ||
          allowedOrigins.includes(origin)
        ) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "50mb" }));

  app.all("/api/auth/*", toNodeHandler(auth));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
