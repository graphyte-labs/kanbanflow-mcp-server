import { logger } from "./mod.ts";

export const init = async (options: Deno.NetAddr): Promise<void> => {
    logger.info(`mcp server running on ${options.hostname}:${options.port}`);
};
