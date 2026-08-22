import { randomUUID } from 'crypto';

export function requestId(req, res, next) {
  const id = randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
}
