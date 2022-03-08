class IncorrectValueError<T extends Record<string, unknown>> extends Error {
  readonly value: keyof T;

  constructor(value: keyof T, message: string) {
    super(message);
    this.name = 'IncorrectValueError';
    this.value = value;
  }
}

export default IncorrectValueError;
