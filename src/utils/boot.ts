import { config } from "../config.ts";
import { logger } from "./mod.ts";

export const init = (options: Deno.NetAddr): void => {
    logger.info("mcp server started", {
        name: config.MCP_SERVER_NAME,
        version: config.MCP_SERVER_VERSION,
        address: `${options.hostname}:${options.port}`,
    });
};
