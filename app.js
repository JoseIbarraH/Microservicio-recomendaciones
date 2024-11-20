const express = require('express');
const preferencesRoutes = require('./routes/preferences');

const app = express();
app.use(express.json());

// Usar las rutas de preferencias
app.use(preferencesRoutes);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Service running on http://localhost:${PORT}`);
});
