-- Creación de la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de datos de ejemplo
INSERT INTO usuarios (nombre, email) VALUES ('Ana García', 'ana.garcia@example.com');
INSERT INTO usuarios (nombre, email) VALUES ('Carlos Rodriguez', 'carlos.r@example.com');
INSERT INTO usuarios (nombre, email) VALUES ('Beatriz López', 'beatriz.lopez@example.com');
INSERT INTO usuarios (nombre, email) VALUES ('David Martinez', 'david.m@example.com');
INSERT INTO usuarios (nombre, email) VALUES ('Elena Sanchez', 'elena.s@example.com');
