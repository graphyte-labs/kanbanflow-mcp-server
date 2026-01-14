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

- `getBoard` - Get board structure (columns, swimlanes, colors)
- `getAllTasks` - Get all tasks
- `getTasksByColumn` - Filter tasks by column
- `getTaskById` - Get specific task by ID
