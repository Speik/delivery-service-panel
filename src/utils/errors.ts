class RequestError extends Error {
  public name = 'RequestError';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

class UnauthorizedError extends Error {
  public name = 'UnauthorizedError';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export { RequestError, UnauthorizedError };