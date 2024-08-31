
import { getRepository } from 'typeorm';
import { Measure } from '../entities/measure';

type MeasureData = {
    uuid: string;
    customerCode: string;
    measureType: 'WATER' | 'GAS';
    measureDate: Date;
    value: number;
    imageUrl: string;
};


export const checkMeasureExists = async (measure_uuid: string): Promise<boolean> => {
    const measureRepository = getRepository(Measure);
    const measure = await measureRepository.findOne({ where: { uuid: measure_uuid } });
    return measure !== null; 
};

export const checkMeasureConfirmed = async (measure_uuid: string): Promise<boolean> => {
    const measureRepository = getRepository(Measure);
    const measure = await measureRepository.findOne({ where: { uuid: measure_uuid } });
    return measure !== null && measure.isConfirmed; 
};

export const saveConfirmedValue = async (measure_uuid: string, value: number): Promise<void> => {
    const measureRepository = getRepository(Measure);
    const measure = await measureRepository.findOne({ where: { uuid: measure_uuid } });

    if (measure !== null) {
        measure.confirmedValue = value;
        measure.isConfirmed = true;
        await measureRepository.save(measure);
    } else {
        throw new Error('Measure not found'); 
    }
};

export const saveMeasure = (measureData: MeasureData) => {
    
};

export const getMeasuresByCustomer = async (customerCode: string, measureType: string | null) => {
    const measureRepository = getRepository(Measure);

    const query = measureRepository.createQueryBuilder('measure')
        .where('measure.customerCode = :customerCode', { customerCode });

    if (measureType) {
        query.andWhere('measure.measureType = :measureType', { measureType });
    }

    const measures = await query.getMany();
    return measures;
};
