const express = require('express');
const router = express.Router();
const db = require('../database');

// Registrar preferencias
router.post('/preferences', (req, res) => {
    const { userId, preferences } = req.body;
    const preferencesStr = JSON.stringify(preferences);

    db.run(
        `INSERT INTO users (userId, preferences) VALUES (?, ?)`,
        [userId, preferencesStr],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID, userId, preferences });
            }
        }
    );
});

// Obtener recomendaciones especificazs
router.get('/recommendations/:userId', (req, res) => {
    const { userId } = req.params;

    db.get(
        `SELECT preferences FROM users WHERE userId = ?`,
        [userId],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (!row) {
                res.status(404).json({ message: 'User not found' });
            } else {
                const preferences = JSON.parse(row.preferences);
                const recommendations = preferences.map(
                    (pref) => `Recomendacion: ${pref}`
                );
                res.json(recommendations);
            }
        }
    );
});

// Obtener recomendaciones
router.get('/recommendations', (req, res) => {
    db.all(
        `SELECT * FROM users`,
        (err, rows) => {
            if (err) {
                console.error('Error al obtener recomendaciones:', err.message);
                return res.status(500).json({ error: 'Error al obtener recomendaciones' });
            }

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron usuarios' });
            }

            try {
                const recommendations = rows.map(user => {
                    return {
                        id: user.id,
                        name: user.name,
                        preferences: user.preferences ? JSON.parse(user.preferences) : [],
                    };
                });

                res.json({ 
                    success: true,
                    count: recommendations.length,
                    recommendations 
                });

            } catch (parseError) {
                console.error('Error al procesar datos:', parseError);
                res.status(500).json({ error: 'Error al procesar los datos' });
            }
        }
    );
});

// Actualizar preferencias
router.put('/preferences/:userId', (req, res) => {
    const { userId } = req.params;
    const { preferences } = req.body;
    const preferencesStr = JSON.stringify(preferences);

    db.run(
        `UPDATE users SET preferences = ? WHERE userId = ?`,
        [preferencesStr, userId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json({ userId, preferences });
            }
        }
    );
});

router.delete('/preferences/:userId', (req, res) => {
    const { userId } = req.params;

    db.run(
        `DELETE FROM users WHERE userId = ?`,
        [userId],
        function (err) {
            if (err) {
                // Error al ejecutar la consulta
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                // No se encontró el usuario
                res.status(404).json({ message: 'User not found' });
            } else {
                // Eliminación exitosa
                res.status(200).json({ message: 'User deleted successfully' });
            }
        }
    );
});


module.exports = router;
