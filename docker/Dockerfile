FROM denoland/deno:alpine-2.6.4

ARG MCP_SERVER_VERSION="0.0.0-dev"
ARG MCP_SERVER_COMMIT="unknown"

LABEL org.opencontainers.image.title="KanbanFlow MCP Server"
LABEL org.opencontainers.image.description="Model Context Protocol server for KanbanFlow"
LABEL org.opencontainers.image.source="https://github.com/graphyte-labs/kanbanflow-mcp-server"
LABEL org.opencontainers.image.vendor="Graphyte Labs"
LABEL org.opencontainers.image.version="${MCP_SERVER_VERSION}"
LABEL org.opencontainers.image.revision="${MCP_SERVER_COMMIT}"

WORKDIR /app

ENV DENO_DIR="/deno" \
    MCP_SERVER_HOST="0.0.0.0" \
    MCP_SERVER_VERSION="${MCP_SERVER_VERSION}"

COPY deno.jsonc deno.lock ./
COPY src/ ./src/

RUN deno cache --lock=deno.lock ./src/main.ts
RUN chown -R deno:deno /app /deno

USER deno

EXPOSE 3000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=/deno", "/app/src/main.ts"]
