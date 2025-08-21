import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as fs from 'fs/promises';
import * as path from 'path';

// Ruta a nuestro archivo de base de datos.
const DB_PATH = path.join(process.cwd(), 'database', 'mcp.db');

// Variable para mantener una única instancia de la base de datos (Singleton).
let dbInstance: any = null;

/**
 * Inicializa la base de datos.
 * Crea el archivo de la base de datos si no existe y ejecuta el schema.sql
 * para crear las tablas y poblar los datos iniciales.
 */
async function initializeDatabase() {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    const schema = await fs.readFile(path.join(process.cwd(), 'database', 'schema.sql'), 'utf-8');
    await db.exec(schema);
    console.log('Base de datos inicializada correctamente.');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

/**
 * Obtiene la instancia de la conexión a la base de datos.
 * Si la conexión no existe, la inicializa.
 * @returns La instancia de la base de datos.
 */
async function getDb() {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

/**
 * Ejecuta una consulta SQL de solo lectura (SELECT) y devuelve todos los resultados.
 * @param query La consulta SQL a ejecutar.
 * @param params Los parámetros para la consulta.
 * @returns Un array de objetos con los resultados.
 */
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const db = await getDb();
    const results = await db.all(query, params);
    return results;
  } catch (error: any) {
    console.error(`Error al ejecutar la consulta "${query}":`, error);
    // Devolvemos un objeto de error estructurado para que la herramienta MCP lo maneje.
    return { error: `Error de base de datos: ${error.message}` };
  }
}
