import app from './api/index.js';

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), () => {
  console.log(`🚀 Permit Backend API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger en http://localhost:${PORT}/swagger`);
});

