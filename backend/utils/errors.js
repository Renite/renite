export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Supabase/PostgREST errors don't carry an HTTP status the way AppError
// does. This maps the common cases so a raw `throw error` from a
// `.select()`/`.insert()` call still produces a sane response instead of
// falling through to a generic 500.
export function toAppError(err, fallbackMessage = 'Something went wrong') {
  if (err instanceof AppError) return err;
  if (err?.code === '23505') return new AppError(409, 'ALREADY_EXISTS', 'This record already exists');
  if (err?.code === '23503') return new AppError(400, 'INVALID_REFERENCE', 'Referenced record does not exist');
  if (err?.code === 'PGRST116') return new AppError(404, 'NOT_FOUND', 'Record not found');
  return new AppError(500, 'INTERNAL_ERROR', err?.message || fallbackMessage);
}
