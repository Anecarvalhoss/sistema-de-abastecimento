import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import abastecimentoRoutes from './routes/abastecimentoRoutes';
import confirmRoutes from './routes/confirmRoutes';
import listRoutes from './routes/listRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/images', abastecimentoRoutes);
app.use('/api', confirmRoutes);
app.use('/api', listRoutes);

export default app;
