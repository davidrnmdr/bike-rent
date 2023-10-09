export class UserWithOpenRentError extends Error {
  public readonly name = "UserWithOpenRentError";

  constructor() {
    super("User has an open rent.");
  }
}
