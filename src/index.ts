import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Instancia básica del servidor MCP
const server = new McpServer({
  name: "mcp-basic-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});

// Ejemplo de herramienta expuesta
server.tool(
  "hello_world",
  "Devuelve un saludo básico.",
  {},
  async () => ({
    content: [
      { type: "text", text: "¡Hola desde el MCP básico!" },
    ],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP básico corriendo en stdio");
}

main().catch((err) => {
  console.error("Error fatal en MCP básico:", err);
  process.exit(1);
});
