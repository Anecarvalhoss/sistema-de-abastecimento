import request from 'supertest';
import app from '../src/app'; 

describe('API Endpoints', () => {
    describe('POST /upload', () => {
        it('should return 200 for a valid request', async () => {
            const response = await request(app)
                .post('/upload')
                .send({
                    image: "data:image/png;base64,...", 
                    customer_code: "12345",
                    measure_datetime: "2024-08-30T12:00:00Z",
                    measure_type: "WATER"
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('image_url');
            expect(response.body).toHaveProperty('measure_value');
            expect(response.body).toHaveProperty('measure_uuid');
        });

        it('should return 400 for invalid base64', async () => {
            const response = await request(app)
                .post('/upload')
                .send({
                    image: "invalid_base64_string",
                    customer_code: "12345",
                    measure_datetime: "2024-08-30T12:00:00Z",
                    measure_type: "WATER"
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        });

        it('should return 409 if measure already exists for the month', async () => {
            const response = await request(app)
                .post('/upload')
                .send({
                    image: "data:image/png;base64,...",
                    customer_code: "12345",
                    measure_datetime: "2024-08-30T12:00:00Z",
                    measure_type: "WATER"
                });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('error_code', 'DOUBLE_REPORT');
        });
    });

    describe('PATCH /confirm', () => {
        it('should return 200 for a valid confirmation', async () => {
            const response = await request(app)
                .patch('/confirm')
                .send({
                    measure_uuid: "example-uuid",
                    confirmed_value: 100
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });

        it('should return 400 for invalid data', async () => {
            const response = await request(app)
                .patch('/confirm')
                .send({
                    measure_uuid: "example-uuid",
                    confirmed_value: "not_a_number"
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        });

        it('should return 404 if measure not found', async () => {
            const response = await request(app)
                .patch('/confirm')
                .send({
                    measure_uuid: "nonexistent-uuid",
                    confirmed_value: 100
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error_code', 'MEASURE_NOT_FOUND');
        });

        it('should return 409 if measure already confirmed', async () => {
            const response = await request(app)
                .patch('/confirm')
                .send({
                    measure_uuid: "already-confirmed-uuid",
                    confirmed_value: 100
                });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('error_code', 'CONFIRMATION_DUPLICATE');
        });
    });

    describe('GET /<customer_code>/list', () => {
        it('should return 200 for a valid request', async () => {
            const response = await request(app)
                .get('/12345/list?measure_type=WATER');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('customer_code', '12345');
            expect(response.body).toHaveProperty('measures');
            expect(Array.isArray(response.body.measures)).toBe(true);
        });

        it('should return 400 for invalid measure_type', async () => {
            const response = await request(app)
                .get('/12345/list?measure_type=INVALID_TYPE');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error_code', 'INVALID_TYPE');
        });

        it('should return 404 if no measures are found', async () => {
            const response = await request(app)
                .get('/12345/list'); 

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error_code', 'MEASURES_NOT_FOUND');
        });
    });
});

