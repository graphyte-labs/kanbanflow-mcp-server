import { z } from "@zod/zod";
import {
    BoardColorSchema,
    BoardColumnSchema,
    BoardResponseSchema,
    BoardSwimlaneSchema,
    TaskCollaboratorSchema,
    TaskNumberSchema,
    TaskSchema,
    TasksColumnResponseSchema,
    TasksResponseSchema,
    UserSchema,
    UsersResponseSchema,
} from "./schemas.ts";

// Main types
export type Task = z.infer<typeof TaskSchema>;
export type Board = z.infer<typeof BoardResponseSchema>;
export type TasksResponse = z.infer<typeof TasksResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;

// Sub-schema types
export type TaskNumber = z.infer<typeof TaskNumberSchema>;
export type TaskCollaborator = z.infer<typeof TaskCollaboratorSchema>;
export type BoardColumn = z.infer<typeof BoardColumnSchema>;
export type BoardSwimlane = z.infer<typeof BoardSwimlaneSchema>;
export type BoardColor = z.infer<typeof BoardColorSchema>;
export type TasksColumnResponse = z.infer<typeof TasksColumnResponseSchema>;

/**
 * Options for filtering tasks by column
 */
export interface GetTasksOptions {
    columnId?: string;
    columnName?: string;
    columnIndex?: number;
    startTaskId?: string;
    startGroupingDate?: string;
    limit?: number;
    order?: "asc" | "desc";
    includePosition?: boolean;
}
