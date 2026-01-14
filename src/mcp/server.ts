import { Context, Hono } from "@hono/hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../config.ts";
import { logger } from "../utils/mod.ts";

export const mcpServer = new McpServer({
    name: config.MCP_SERVER_NAME,
    version: "0.0.1",
});

export const mcpRouter = new Hono();
const transport = new StreamableHTTPTransport();

mcpRouter.all("/mcp", async (c: Context) => {
    if (!mcpServer.isConnected()) {
        logger.info("mcp server connecting to transport");
        await mcpServer.connect(transport);
        logger.info("mcp server connected", {
            name: config.MCP_SERVER_NAME,
            version: "0.0.1",
        });
    }

    logger.debug("mcp request received", {
        method: c.req.method,
        path: c.req.path,
    });

    return transport.handleRequest(c);
});
