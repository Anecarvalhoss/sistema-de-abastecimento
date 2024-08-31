import { v4 as uuidv4 } from 'uuid';

interface Measure {
    customerCode: string;
    measureType: string;
    measureDate: Date;
}


const mockDatabase: Measure[] = [
    { customerCode: '123', measureType: 'WATER', measureDate: new Date('2024-08-01') },
    { customerCode: '123', measureType: 'GAS', measureDate: new Date('2024-08-10') },
    { customerCode: '456', measureType: 'WATER', measureDate: new Date('2024-08-15') },
];

export const validateBase64 = (base64: string): boolean => {
    const base64Regex = /^data:image\/(png|jpeg);base64,/;
    return base64Regex.test(base64);
};

export const checkExistingMeasure = (customerCode: string, measureType: string, measureDate: Date): boolean => {
    
    const startOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth(), 1);
    const endOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth() + 1, 0);

    const existingMeasure = mockDatabase.find(measure => 
        measure.customerCode === customerCode &&
        measure.measureType === measureType &&
        measure.measureDate >= startOfMonth &&
        measure.measureDate <= endOfMonth
    );

    return !!existingMeasure; 
};

export const generateGUID = (): string => {
    return uuidv4();
};
