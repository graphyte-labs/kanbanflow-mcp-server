import { Context, Hono } from "@hono/hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../config.ts";
import { logger } from "../utils/mod.ts";
import { registerTools } from "./tools.ts";

export const mcpRouter = new Hono();

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

// Stateless: a fresh server and transport per request. A shared transport routes
// responses by JSON-RPC id, so concurrent clients reusing the same ids stole each
// other's responses, and only one client could hold the GET stream.
mcpRouter.post("/mcp", async (c: Context) => {
    const server = new McpServer({
        name: config.MCP_SERVER_NAME,
        version: config.MCP_SERVER_VERSION,
    });
    registerTools(server);
    const transport = new StreamableHTTPTransport({ enableJsonResponse: true });
    await server.connect(transport);
    return transport.handleRequest(c);
});

// No sessions, so no server-initiated stream to open or session to delete.
mcpRouter.on(
    ["GET", "DELETE"],
    "/mcp",
    (c: Context) => c.json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null }, 405),
);
