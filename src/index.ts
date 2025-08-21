import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";
import * as fs from 'fs/promises';
import * as path from 'path';
import { executeQuery } from './database.js'; // Importamos nuestra función de base de datos

// Instancia básica del servidor MCP
const server = new McpServer({
  name: "mcp-avanzado-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});

// 1. Herramienta básica sin parámetros (la que ya tenías)
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

// 2. NUEVA HERRAMIENTA: Sumar dos números
server.tool(
  "sumar",
  "Suma dos números y devuelve el resultado.",
  // Definimos los parámetros de entrada con Zod
  {
    a: z.number().describe("El primer número para sumar"),
    b: z.number().describe("El segundo número para sumar"),
  },
  // La función ahora recibe los parámetros validados
  async ({ a, b }) => ({
    content: [
      { type: "text", text: `El resultado de sumar ${a} y ${b} es ${a + b}` },
    ],
  })
);

// 3. NUEVA HERRAMIENTA: Leer el contenido de un archivo
server.tool(
  "leer_archivo",
  "Lee el contenido de un archivo en el workspace y lo devuelve como texto.",
  {
    ruta: z.string().describe("La ruta relativa del archivo a leer desde el workspace."),
  },
  async ({ ruta }) => {
    try {
      // Por seguridad, nos aseguramos de que la ruta sea relativa al proyecto
      const workspaceRoot = process.cwd();
      const rutaAbsoluta = path.join(workspaceRoot, ruta);

      // Validamos que la ruta no intente salir del directorio del proyecto
      if (!rutaAbsoluta.startsWith(workspaceRoot)) {
        throw new Error("Acceso a la ruta denegado.");
      }

      const contenido = await fs.readFile(rutaAbsoluta, 'utf-8');
      return {
        content: [
          { type: "text", text: `Contenido de '${ruta}':\n\n${contenido}` },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error al leer el archivo: ${error.message}` },
        ],
      };
    }
  }
);

// 5. NUEVA HERRAMIENTA: Ejecutar una consulta SQL en la base de datos
server.tool(
  "ejecutar_query",
  "Ejecuta una consulta SQL de solo lectura (SELECT) en la base de datos SQLite y devuelve los resultados.",
  {
    query: z.string().describe("La consulta SQL SELECT a ejecutar. Por seguridad, no se permiten operaciones de escritura (INSERT, UPDATE, DELETE)."),
  },
  async ({ query }) => {
    // Medida de seguridad simple: solo permitir consultas SELECT.
    if (!query.trim().toLowerCase().startsWith('select')) {
      return {
        content: [{ type: "text", text: "Error: Solo se permiten consultas SELECT." }],
      };
    }

    try {
      const results = await executeQuery(query);
      
      if (results.error) {
        return { content: [{ type: "text", text: `Error de base de datos: ${results.error}` }] };
      }

      if (results.length === 0) {
        return { content: [{ type: "text", text: "La consulta no devolvió resultados." }] };
      }

      // Formatear la salida como una tabla de Markdown para que sea legible.
      const headers = Object.keys(results[0]);
      const headerLine = `| ${headers.join(' | ')} |`;
      const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
      const bodyLines = results.map((row: any) => `| ${headers.map(h => row[h]).join(' | ')} |`).join('\n');
      
      const formattedResults = `Resultados de la consulta:\n\n${headerLine}\n${separatorLine}\n${bodyLines}`;

      return {
        content: [{ type: "text", text: formattedResults }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error inesperado al ejecutar la consulta: ${error.message}` }],
      };
    }
  }
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP avanzado corriendo en stdio");
}

main().catch((err) => {
  console.error("Error fatal en MCP:", err);
  process.exit(1);
});