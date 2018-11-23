// Custom error types
export interface ErrorData {
  [key: string]: any;
}

export type PreviousError = Error | ApplicationError | null;

export class ApplicationError {
  name: string;
  message: string;
  code: string;
  prev: PreviousError;
  data?: ErrorData;
  constructor(
    name: string = "ApplicationError",
    message: string = "Application encountered an error",
    code: string = "error",
    prev: PreviousError = null,
    data: ErrorData = {}
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.prev = prev;
    this.data = data;
  }
}
