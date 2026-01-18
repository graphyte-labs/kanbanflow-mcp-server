#!/usr/bin/env bash
set -euo pipefail

image="graphyte-labs/kanbanflow-mcp-server"
version="${MCP_SERVER_VERSION:-v0.0.0}"
commit="${MCP_SERVER_COMMIT:-$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")}"

# Construct dev version if no explicit version set
if [ "${version}" = "v0.0.0" ]; then
    version="v0.0.0-dev"
fi

docker buildx build \
    --build-arg MCP_SERVER_VERSION="${version}" \
    --build-arg MCP_SERVER_COMMIT="${commit}" \
    -t "${image}:${version}" \
    -t "${image}:latest" \
    -f docker/Dockerfile \
    .
