import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Resolve frontend dist relative to THIS compiled file (artifacts/api-server/dist/index.mjs)
// so it works regardless of CWD (critical for Render.com deployments)
const __dirnameSafe = typeof import.meta.dirname !== "undefined"
  ? import.meta.dirname
  : path.dirname(fileURLToPath(import.meta.url));

// From artifacts/api-server/dist/ → ../../../ → workspace root → artifacts/shadj/dist/public
const frontendDist = path.resolve(__dirnameSafe, "../../../artifacts/shadj/dist/public");

if (existsSync(frontendDist)) {
  app.use(
    "/assets",
    express.static(path.join(frontendDist, "assets"), {
      maxAge: "1y",
      immutable: true,
    }),
  );

  app.use(
    "/posters",
    express.static(path.join(frontendDist, "posters"), {
      maxAge: "7d",
    }),
  );

  app.use(
    express.static(frontendDist, {
      maxAge: "1h",
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      },
    }),
  );

  app.get("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
