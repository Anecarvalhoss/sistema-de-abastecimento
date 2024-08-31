import { Router } from 'express';
import { uploadImage } from '../controllers/abastecimentoController';

const router = Router();

router.post('/upload', uploadImage);

export default router;
