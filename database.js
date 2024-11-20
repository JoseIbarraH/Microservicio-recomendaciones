const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos SQLite (o crearla si no existe)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Crear tabla si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT UNIQUE NOT NULL,
            preferences TEXT NOT NULL
        )
    `);
});

module.exports = db;
