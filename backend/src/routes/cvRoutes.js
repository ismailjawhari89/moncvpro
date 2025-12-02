import express from 'express';
import { saveCV } from '../controllers/cvController.js';

const router = express.Router();

router.post('/', saveCV);

export default router;
