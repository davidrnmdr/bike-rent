export class BikeAlreadyRegisteredError extends Error {
  public readonly name = "BikeAlreadyRegisteredError";

  constructor() {
    super("Bike Already Registered.");
  }
}
