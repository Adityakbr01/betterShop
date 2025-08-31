// src/exceptions/HttpException.ts
class HttpException<T = unknown> extends Error {
  public status: number;
  public errors?: T;

  constructor(status: number, message: string, errors?: T) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export default HttpException;
