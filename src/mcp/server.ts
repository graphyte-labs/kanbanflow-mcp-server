import { Context, Hono } from "@hono/hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../config.ts";

export const mcpServer = new McpServer({
    name: config.MCP_SERVER_NAME,
    version: config.MCP_SERVER_VERSION,
});

export const mcpRouter = new Hono();
const transport = new StreamableHTTPTransport();

mcpRouter.all("/mcp", async (c: Context) => {
    if (!mcpServer.isConnected()) {
        await mcpServer.connect(transport);
    }
    return transport.handleRequest(c);
});
