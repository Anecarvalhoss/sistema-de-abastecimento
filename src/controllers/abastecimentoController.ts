import { Request, Response } from 'express';
import { analyzeImage } from '../services/geminiService';
import  { validateBase64, checkExistingMeasure, generateGUID } from '../utils/helprs';
import { saveMeasure } from '../services/measureService';


export const uploadImage = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    
    if (!validateBase64(image)) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "O formato da imagem base64 é inválido"
        });
    }

    if (!['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Tipo de medição inválido"
        });
    }

    const measureDate = new Date(measure_datetime);

    if (checkExistingMeasure(customer_code, measure_type.toUpperCase(), measureDate)) {
        return res.status(409).json({
            error_code: "DOUBLE_REPORT",
            error_description: "Leitura do mês já realizada"
        });
    }

    try {
       
        const measureValue = await analyzeImage(image); 
        if (typeof measureValue !== 'number') {
            throw new Error('Valor da medida deve ser um número');
        }

        const measureUUID = generateGUID();
        const imageUrl = `http://example.com/${measureUUID}`; 

        
        saveMeasure({
            uuid: measureUUID,
            customerCode: customer_code,
            measureType: measure_type.toUpperCase(),
            measureDate,
            value: measureValue, 
            imageUrl
        });

       
        res.status(200).json({
            image_url: imageUrl,
            measure_value: measureValue,
            measure_uuid: measureUUID
        });
    } catch (error) {
        res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "Ocorreu um erro ao processar a imagem"
        });
    }
};
