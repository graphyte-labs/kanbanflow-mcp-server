# kanbanflow-mcp-server

Model Context Protocol server for [KanbanFlow](https://kanbanflow.com).

## Setup

Set your KanbanFlow API key:

```bash
export KANBANFLOW_API_KEY="your-api-key-here"
```

## Run

```bash
deno run --allow-net --allow-env src/main.ts
```

Server starts at `http://127.0.0.1:3000`

## Available Tools

> **Note:** This MCP server currently provides basic read-only tools for KanbanFlow. Many API methods are not yet implemented - see the TODO section below for planned features.

- `getBoard` - Get board structure (columns, swimlanes, colors)
- `getAllTasks` - Get all tasks
- `getTasksByColumn` - Filter tasks by column
- `getTaskById` - Get specific task by ID

## TODO

### Task Management
- [ ] `createTask` - Create a new task
- [ ] `updateTask` - Update an existing task
- [ ] `deleteTask` - Delete a task
- [ ] `moveTask` - Move a task to a different column/position

### Subtasks
- [ ] `createSubtask` - Add a subtask to a task
- [ ] `updateSubtask` - Update a subtask
- [ ] `deleteSubtask` - Delete a subtask

### Collaborators
- [ ] `addCollaborator` - Add a collaborator to a task
- [ ] `removeCollaborator` - Remove a collaborator from a task

### Comments
- [ ] `addComment` - Add a comment to a task
- [ ] `getComments` - Get comments for a task
- [ ] `deleteComment` - Delete a comment

### Users
- [ ] `getUsers` - Get all users on the board

### Time Tracking (Pomodoro)
- [ ] `startTimer` - Start a Pomodoro timer for a task
- [ ] `stopTimer` - Stop the current timer
- [ ] `getTimeEntries` - Get time entries for a task
- [ ] `deleteTimeEntry` - Delete a time entry

## Contributing

Contributions are welcome! Feel free to:
- Implement missing API methods from the TODO list
- Fix bugs or improve existing functionality
- Enhance documentation
- Report issues or suggest features

Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
