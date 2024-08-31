import { Request, Response } from 'express';
import { getMeasuresByCustomer } from '../services/measureService';

export const listMeasures = async (req: Request, res: Response) => {
    const customerCode = req.params.customer_code;
    const measureType = req.query.measure_type as string;

    if (measureType && !['WATER', 'GAS'].includes(measureType.toUpperCase())) {
        return res.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida"
        });
    }

    try {
        // Adicione 'await' aqui para resolver a Promise antes de acessar 'measures'
        const measures = await getMeasuresByCustomer(customerCode, measureType ? measureType.toUpperCase() : null);

        if (measures.length === 0) {
            return res.status(404).json({
                error_code: "MEASURES_NOT_FOUND",
                error_description: "Nenhuma leitura encontrada"
            });
        }

        res.status(200).json({
            customer_code: customerCode,
            measures
        });
    } catch (error) {
        res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "Ocorreu um erro ao buscar as leituras"
        });
    }
};