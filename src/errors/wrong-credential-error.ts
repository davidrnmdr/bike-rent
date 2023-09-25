export class WrongCredentialError extends Error {
  public readonly name = "WrongCredentialError";

  constructor() {
    super("Wrong credential, unable to authenticate.");
  }
}
