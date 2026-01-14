import { Hono } from "@hono/hono";
import { init, loggerMiddleware } from "./utils/mod.ts";
import { config } from "./config.ts";
import { mcpRouter } from "./mcp/mod.ts";

const app = new Hono();

app.use(loggerMiddleware());
app.route("/", mcpRouter);

Deno.serve({
    hostname: config.MCP_SERVER_HOST,
    port: config.MCP_SERVER_PORT,
    onListen: init,
}, (request: Request) => {
    return app.fetch(request);
});
