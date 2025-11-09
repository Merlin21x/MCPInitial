# MCP Básico para GitHub Copilot

Este proyecto implementa un servidor básico Model Context Protocol (MCP) en TypeScript, siguiendo las mejores prácticas y la especificación oficial. Está diseñado para ser utilizado y depurado con GitHub Copilot y otros clientes MCP compatibles.

<a href="https://glama.ai/mcp/servers/@Merlin21x/MCPInitial">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Merlin21x/MCPInitial/badge" alt="Basic Server MCP server" />
</a>

## Recursos útiles
- [Documentación oficial de MCP](https://modelcontextprotocol.io/)
- [SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Ejemplo de servidores MCP](https://github.com/modelcontextprotocol/servers)

## Estructura mínima
- Servidor MCP básico en TypeScript
- Configuración para stdio (recomendado para integración local con VS Code y Copilot)
- Archivos de configuración para VS Code y MCP

## Pasos para iniciar
1. Instala Node.js 16+ y npm.
2. Instala las dependencias:
   ```powershell
   npm install @modelcontextprotocol/sdk zod
   npm install -D typescript @types/node
   ```
3. Compila el servidor:
   ```powershell
   npx tsc
   ```
4. Ejecuta el servidor MCP:
   ```powershell
   node build/index.js
   ```
5. Configura tu cliente MCP (por ejemplo, Claude Desktop, VS Code Copilot) para conectar con este servidor usando stdio.

## Seguridad y mejores prácticas
- No escribas en stdout desde el servidor, solo usa stderr para logs.
- Consulta la [guía de seguridad MCP](https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices) para detalles sobre autenticación y autorización.

---

Este proyecto es un punto de partida. Personalízalo según tus necesidades y consulta la documentación oficial para aprovechar todo el potencial de MCP.