import { Context, Hono } from "@hono/hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../config.ts";
import { logger } from "../utils/mod.ts";

export const mcpServer = new McpServer({
    name: config.MCP_SERVER_NAME,
    version: config.MCP_SERVER_VERSION,
});

export const mcpRouter = new Hono();
const transport = new StreamableHTTPTransport();
let connection: Promise<void> | undefined;

// Authentication middleware
mcpRouter.use(async (c: Context, next) => {
    // Skip authentication if no token is configured
    if (!config.MCP_SERVER_AUTH_TOKEN) {
        logger.debug("mcp auth skipped", { reason: "no token configured" });
        await next();
        return;
    }

    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        logger.warn("mcp auth failed", { reason: "missing authorization header" });
        return c.json({ error: "unauthorized" }, 401);
    }

    const token = authHeader.split(" ").pop() ?? "";

    if (token !== config.MCP_SERVER_AUTH_TOKEN) {
        logger.warn("mcp auth failed", { reason: "invalid token" });
        return c.json({ error: "unauthorized" }, 401);
    }

    logger.debug("mcp auth succeeded");
    await next();
});

mcpRouter.all("/mcp", async (c: Context) => {
    connection ??= mcpServer.connect(transport);
    await connection;
    return transport.handleRequest(c);
});
