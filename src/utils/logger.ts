import { getPath } from "@hono/hono/utils/url";
import { ConsoleHandler, getLogger, setup } from "@std/log";
import type { Context, MiddlewareHandler } from "@hono/hono";

import { config } from "../config.ts";

setup({
    handlers: {
        default: new ConsoleHandler("DEBUG", {
            formatter: (logRecord) => {
                return JSON.stringify({
                    ts: new Date().toISOString(),
                    level: logRecord.levelName,
                    logger: logRecord.loggerName,
                    message: logRecord.msg,
                    context: logRecord.args,
                });
            },
        }),
    },
    loggers: {
        default: {
            level: config.MCP_SERVER_LOG_LEVEL,
            handlers: ["default"],
        },
    },
});

export const logger = getLogger();

export const loggerMiddleware = (): MiddlewareHandler => {
    return async (context: Context, next: () => Promise<void>) => {
        const uuid = crypto.randomUUID().replaceAll("-", "");
        const start = performance.now();
        const path = getPath(context.req.raw);

        logger.debug("inbound request", {
            id: uuid,
            method: context.req.method,
            url: path,
        });
        try {
            context.res.headers.set("X-Request-ID", uuid);
            await next();
        } finally {
            const end = performance.now() - start;

            // Skip generic logging for MCP endpoints since they have detailed tool-level logging
            if (path !== "/mcp") {
                logger.info("request handled", {
                    id: uuid,
                    method: context.req.method,
                    url: path,
                    status: context.res.status,
                    duration: Math.ceil(end),
                });
            }
        }
    };
};
