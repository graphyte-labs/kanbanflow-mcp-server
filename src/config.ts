import { LevelName } from "@std/log";

type McpServerConfig = {
    MCP_SERVER_HOST: string;
    MCP_SERVER_PORT: number;
    MCP_SERVER_NAME: string;
    MCP_SERVER_LOG_LEVEL: LevelName;
    KANBANFLOW_API_KEY: string;
};

export const config = <McpServerConfig> {
    MCP_SERVER_HOST: Deno.env.get("MCP_SERVER_HOST") ?? "127.0.0.1",
    MCP_SERVER_PORT: Deno.env.get("MCP_SERVER_PORT") ?? 3000,
    MCP_SERVER_NAME: Deno.env.get("MCP_SERVER_NAME") ?? "acme-mcp-server",
    MCP_SERVER_LOG_LEVEL: Deno.env.get("MCP_SERVER_LOG_LEVEL") ?? "DEBUG",
    KANBANFLOW_API_KEY: Deno.env.get("KANBANFLOW_API_KEY") ?? "",
};
