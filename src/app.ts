import express from 'express';
import userRoutes from './routes/userRoutes';
import oauthRoutes from './routes/oauthRoutes';
import prisma from './prisma/client';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear form-data
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/user', userRoutes);
app.use('/api/oauth', oauthRoutes);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Cierre del cliente Prisma cuando la aplicación se apaga
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
