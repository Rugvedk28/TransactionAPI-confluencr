export const notFound = (req, res) => res.status(404).json({ timestamp: new Date().toISOString(), status: 404, error: 'NOT_FOUND', message: 'Route not found.', path: req.originalUrl });
