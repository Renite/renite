export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status < 500 ? err.message : 'Something went wrong';
  res.status(status).json({ success: false, error: { code, message } });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
}
