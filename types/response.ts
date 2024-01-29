export interface Response {
  status: number;
  message: string;
}

export class TimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}
