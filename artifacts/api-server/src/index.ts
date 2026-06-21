import app from "./app";
import { logger } from "./lib/logger";
import { connectMongoDB, seedIfEmpty } from "./lib/mongodb";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  await connectMongoDB();
  await seedIfEmpty();

  app.listen(port, (err?: Error) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");

    const appUrl = process.env["RENDER_EXTERNAL_URL"];
    if (appUrl) {
      setInterval(async () => {
        try {
          await fetch(`${appUrl}/api/health`);
        } catch {
          // silent - keep-alive best effort
        }
      }, 14 * 60 * 1000);
    }
  });
}

start().catch(err => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
