import express from 'express';
const cors = require('cors');
import imageRoutes from './routes/imageRoutes';
import userRoutes from './routes/userRoutes';
import oauthRoutes from './routes/oauthRoutes';
import branchRoutes from './routes/branchRoutes';
import serviceRoutes from './routes/serviceRoutes';
import productRoutes from './routes/productRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import reservationRoutes from './routes/reservationRoutes';
import statusRoutes from './routes/statusRoutes';
import categoryRoutes from './routes/categoryRoutes';
import invoiceHeaderRoutes from './routes/invoiceHeaderRoutes';
import prisma from './prisma/client';
import { SchedulerService } from './services/schedulerService';

const app = express();

// Configuración de CORS para permitir cualquier origen
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear form-data
app.use(express.urlencoded({ extended: false }));

// Ruta de salud
app.get('/', (req, res) => {
  res.send('Backend is running correctly');
});

// Rutas
app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/product', productRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/invoice-header', invoiceHeaderRoutes);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

// Cierre del cliente Prisma cuando la aplicación se apaga
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Inicializar el SchedulerService
const scheduler = new SchedulerService();

// Exportar la aplicación
export default app;
