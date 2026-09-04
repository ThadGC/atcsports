export class AppError extends Error {
  constructor(message, status = 400, fields) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

export const badRequest = (msg, fields) => new AppError(msg, 400, fields)
export const unauthorized = (msg = 'Please log in to continue.') => new AppError(msg, 401)
export const forbidden = (msg = 'You do not have access to that.') => new AppError(msg, 403)
export const notFound = (msg = 'Not found.') => new AppError(msg, 404)
export const conflict = (msg, fields) => new AppError(msg, 409, fields)
