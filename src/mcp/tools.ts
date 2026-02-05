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
    "getTasks",
    {
        description: "Get tasks from Kanbanflow. Without filters, returns all tasks. Use filters to narrow results or enable pagination.",
        inputSchema: {
            columnId: z.string().optional().describe("Filter by column ID"),
            columnName: z.string().optional().describe("Filter by column name"),
            columnIndex: z.number().optional().describe("Filter by column index (0-based)"),
            startTaskId: z.string().optional().describe("Task ID to start pagination from (use nextTaskId from previous response)"),
            limit: z.number().optional().describe("Maximum number of tasks to return (enables pagination)"),
            order: z.enum(["asc", "desc"]).optional().describe("Sort order (asc or desc)"),
            includePosition: z.boolean().optional().describe("Include task position in the column"),
        },
    },
    async (args) => {
        try {
            logger.info("mcp tool invoked", { tool: "getTasks", args });

            const tasks = await client.getTasks({
                columnId: args.columnId,
                columnName: args.columnName,
                columnIndex: args.columnIndex,
                startTaskId: args.startTaskId,
                limit: args.limit,
                order: args.order,
                includePosition: args.includePosition,
            });

            const totalTasks = tasks.reduce((sum, col) => sum + col.tasks.length, 0);
            const hasMore = tasks.some((col) => col.tasksLimited);
            const nextTaskId = tasks.find((col) => col.nextTaskId)?.nextTaskId;

            // Check if any filtering is applied
            const hasFilters = args.columnId || args.columnName || args.columnIndex !== undefined;

            logger.info("mcp tool succeeded", {
                tool: "getTasks",
                columnsCount: tasks.length,
                totalTasks,
                hasMore,
                nextTaskId,
                hasFilters,
            });

            const response = {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify(tasks, null, 2),
                    },
                ],
                ...(hasFilters && {
                    _meta: {
                        pagination: {
                            hasMore,
                            nextTaskId: nextTaskId || null,
                            totalReturned: totalTasks,
                            limit: args.limit || null,
                            columnId: args.columnId || null,
                            columnName: args.columnName || null,
                            columnIndex: args.columnIndex !== undefined ? args.columnIndex : null,
                        },
                    },
                }),
            };

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", { tool: "getTasks", error: errorMessage, args });
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

mcpServer.registerTool(
    "getUsers",
    {
        description: "Get all users on the board from Kanbanflow",
        inputSchema: {},
    },
    async () => {
        try {
            logger.info("mcp tool invoked", { tool: "getUsers" });
            const users = await client.getUsers();
            logger.info("mcp tool succeeded", {
                tool: "getUsers",
                userCount: users.length,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(users, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", { tool: "getUsers", error: errorMessage });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching users: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);

mcpServer.registerTool(
    "getComments",
    {
        description: "Get all comments for a specific task from Kanbanflow",
        inputSchema: {
            taskId: z.string().describe("The ID of the task to get comments for"),
        },
    },
    async (args) => {
        try {
            logger.info("mcp tool invoked", { tool: "getComments", taskId: args.taskId });
            const comments = await client.getComments(args.taskId);
            logger.info("mcp tool succeeded", {
                tool: "getComments",
                taskId: args.taskId,
                commentCount: comments.length,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(comments, null, 2),
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error("mcp tool failed", {
                tool: "getComments",
                error: errorMessage,
                taskId: args.taskId,
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching comments for task ${args.taskId}: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    },
);
