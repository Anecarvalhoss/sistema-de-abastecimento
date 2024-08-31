// src/controllers/confirmController.ts

import { Request, Response } from 'express';
import { checkMeasureExists, checkMeasureConfirmed, saveConfirmedValue } from '../services/measureService';

export const confirmMeasure = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { measure_uuid, confirmed_value } = req.body;

       
        const measureExists = await checkMeasureExists(measure_uuid);
        if (!measureExists) {
            return res.status(404).json({
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            });
        }

        
        const isConfirmed = await checkMeasureConfirmed(measure_uuid);
        if (isConfirmed) {
            return res.status(409).json({
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura já confirmada"
            });
        }

        
        await saveConfirmedValue(measure_uuid, confirmed_value);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "Erro interno do servidor"
        });
    }
};

