export class MiddlewareErrors extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ServerError extends MiddlewareErrors {
  constructor(message: string) {
    super(message, 500)
  }
}

export class NotFoundError extends MiddlewareErrors {
  constructor(message: string) {
    super(message, 404)
  }
}

export class BadRequestError extends MiddlewareErrors {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnAuthorizationError extends MiddlewareErrors {
  constructor(message: string) {
    super(message, 401)
  }
}
