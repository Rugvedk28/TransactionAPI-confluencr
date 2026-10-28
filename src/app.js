import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { accountRouter } from './routes/account.routes.js';
import { transferRouter } from './routes/transfer.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { openapi } from './openapi.js';
export const createApp = () => { const app = express(); app.use(express.json()); app.get('/health', (req, res) => res.json({ status: 'ok' })); app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi)); app.use('/api/v1/accounts', accountRouter); app.use('/api/v1/transfers', transferRouter); app.use(notFound); app.use(errorHandler); return app; };
