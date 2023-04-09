export class ResponseValidationError extends Error {
  public details: Record<any, any>;

  constructor(validationResult: Record<any, any>) {
    super("Response doesn't match the schema");
    this.name = 'ResponseValidationError';
    this.details = validationResult.error;
  }
}
