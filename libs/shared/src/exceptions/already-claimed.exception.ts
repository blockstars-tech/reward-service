export class AlreadyClaimedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlreadyClaimedException';
  }
}
