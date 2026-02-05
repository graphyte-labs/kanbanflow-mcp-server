import type { Comment, CommentsResponse, Task, TasksResponse, User } from "../kanbanflow/types.ts";
import { KanbanFlowClient } from "../kanbanflow/mod.ts";
import { logger } from "../utils/mod.ts";

/**
 * UserResolver handles fetching and caching users, and enriching data with user information
 */
export class UserResolver {
    private client: KanbanFlowClient;
    private userCache: Map<string, User> | null = null;

    constructor(client: KanbanFlowClient) {
        this.client = client;
    }

    /**
     * Fetches and caches all users from the board
     */
    private async getUserMap(): Promise<Map<string, User>> {
        if (this.userCache) {
            logger.debug("mcp users cache hit");
            return this.userCache;
        }

        logger.info("mcp users fetched");
        const users = await this.client.getUsers();
        this.userCache = new Map(users.map((user) => [user._id, user]));
        return this.userCache;
    }

    /**
     * Clears the user cache
     */
    clearCache(): void {
        this.userCache = null;
        logger.debug("mcp users cache cleared");
    }

    /**
     * Enriches a single task with user information
     */
    async enrichTask(task: Task): Promise<Task & Record<string, unknown>> {
        const userMap = await this.getUserMap();
        const enriched: Task & Record<string, unknown> = { ...task };

        // Enrich responsible user
        if (task.responsibleUserId) {
            const user = userMap.get(task.responsibleUserId);
            if (user) {
                enriched.responsibleUserName = user.fullName;
            }
        }

        // Enrich collaborators
        if (task.collaborators && task.collaborators.length > 0) {
            enriched.collaborators = task.collaborators.map((collaborator) => {
                const user = userMap.get(collaborator.userId);
                return {
                    ...collaborator,
                    userName: user?.fullName,
                };
            });
        }

        return enriched;
    }

    /**
     * Enriches a tasks response (array of columns with tasks)
     */
    async enrichTasks(tasksResponse: TasksResponse): Promise<TasksResponse> {
        const userMap = await this.getUserMap();

        return tasksResponse.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) => {
                const enriched: Task & Record<string, unknown> = { ...task };

                // Enrich responsible user
                if (task.responsibleUserId) {
                    const user = userMap.get(task.responsibleUserId);
                    if (user) {
                        enriched.responsibleUserName = user.fullName;
                    }
                }

                // Enrich collaborators
                if (task.collaborators && task.collaborators.length > 0) {
                    enriched.collaborators = task.collaborators.map((collaborator) => {
                        const user = userMap.get(collaborator.userId);
                        return {
                            ...collaborator,
                            userName: user?.fullName,
                        };
                    });
                }

                return enriched;
            }),
        }));
    }

    /**
     * Enriches a single comment with author information
     */
    async enrichComment(comment: Comment): Promise<Comment & Record<string, unknown>> {
        const userMap = await this.getUserMap();
        const enriched: Comment & Record<string, unknown> = { ...comment };

        const user = userMap.get(comment.authorUserId);
        if (user) {
            enriched.authorUserName = user.fullName;
        }

        return enriched;
    }

    /**
     * Enriches an array of comments with author information
     */
    async enrichComments(comments: CommentsResponse): Promise<CommentsResponse> {
        const userMap = await this.getUserMap();

        return comments.map((comment) => {
            const enriched: Comment & Record<string, unknown> = { ...comment };
            const user = userMap.get(comment.authorUserId);
            if (user) {
                enriched.authorUserName = user.fullName;
            }
            return enriched;
        });
    }
}
