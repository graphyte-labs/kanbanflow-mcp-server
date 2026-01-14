import { z } from "@zod/zod";
import { mcpServer } from "./mod.ts";
import { logger } from "../utils/mod.ts";
import { KanbanFlowClient } from "../kanbanflow/mod.ts";

// Create a shared client instance
const client = new KanbanFlowClient();

mcpServer.registerTool(
    "getBoard",
    {
        description: "Get the board structure including columns, swimlanes, and colors from Kanbanflow",
        inputSchema: {},
    },
    async () => {
        try {
            logger.info("mcp tool invoked", { tool: "getBoard" });
            const board = await client.getBoard();
            logger.info("mcp tool succeeded", {
                tool: "getBoard",
                columnsCount: board.columns.length,
                swimlanesCount: board.swimlanes?.length ?? 0,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(board, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", { tool: "getBoard", error: errorMessage });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching board: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);

mcpServer.registerTool(
    "getAllTasks",
    {
        description: "Get all tasks from Kanbanflow",
        inputSchema: {},
    },
    async () => {
        try {
            logger.info("mcp tool invoked", { tool: "getAllTasks" });
            const tasks = await client.getTasks();
            const totalTasks = tasks.reduce((sum, col) => sum + col.tasks.length, 0);
            logger.info("mcp tool succeeded", {
                tool: "getAllTasks",
                columnsCount: tasks.length,
                totalTasks,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(tasks, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", { tool: "getAllTasks", error: errorMessage });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching tasks: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);

mcpServer.registerTool(
    "getTasksByColumn",
    {
        description: "Get tasks filtered by column from Kanbanflow. You can filter by columnId, columnName, or columnIndex",
        inputSchema: {
            columnId: z.string().optional().describe("Filter by column ID"),
            columnName: z.string().optional().describe("Filter by column name"),
            columnIndex: z.number().optional().describe("Filter by column index (0-based)"),
            limit: z.number().optional().describe("Limit the number of tasks returned"),
            order: z.enum(["asc", "desc"]).optional().describe("Order of tasks (asc or desc)"),
            includePosition: z.boolean().optional().describe("Include task position in the column"),
        },
    },
    async (args) => {
        try {
            logger.info("mcp tool invoked", { tool: "getTasksByColumn", args });
            const tasks = await client.getTasks({
                columnId: args.columnId,
                columnName: args.columnName,
                columnIndex: args.columnIndex,
                limit: args.limit,
                order: args.order,
                includePosition: args.includePosition,
            });
            const totalTasks = tasks.reduce((sum, col) => sum + col.tasks.length, 0);
            logger.info("mcp tool succeeded", {
                tool: "getTasksByColumn",
                columnsCount: tasks.length,
                totalTasks,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(tasks, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", {
                tool: "getTasksByColumn",
                error: errorMessage,
                args,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching tasks by column: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);

mcpServer.registerTool(
    "getTaskById",
    {
        description: "Get a specific task by ID from Kanbanflow",
        inputSchema: {
            taskId: z.string().describe("The ID of the task to retrieve"),
            includePosition: z.boolean().optional().describe("Include the task's position in the column"),
        },
    },
    async (args) => {
        try {
            logger.info("mcp tool invoked", { tool: "getTaskById", taskId: args.taskId });
            const task = await client.getTaskById(args.taskId, args.includePosition ?? false);
            logger.info("mcp tool succeeded", {
                tool: "getTaskById",
                taskId: args.taskId,
                taskName: task.name,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(task, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", {
                tool: "getTaskById",
                error: errorMessage,
                taskId: args.taskId,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching task ${args.taskId}: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);
