export class InsufficientBalanceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientBalanceException';
  }
}
