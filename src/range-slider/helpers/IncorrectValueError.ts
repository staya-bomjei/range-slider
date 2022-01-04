export default class IncorrectValueError<T extends Object> extends Error {
  value: keyof T;

  constructor(value: keyof T, message: string) {
    super(message);
    this.name = 'IncorrectValueError';
    this.value = value;
  }
}
