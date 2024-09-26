import { ValidationError } from "./errors.js";
import { User } from "./user-repository.js";

export default class Validation {
  static password(password) {
    if (typeof password !== "string")
      throw new ValidationError("password must be a string");
    if (password.length < 6)
      throw new ValidationError("password must be at least 6 characters long");
  }

  static username(username) {
    if (typeof username !== "string")
      throw new ValidationError("username must be a string");
    if (username.length < 3)
      throw new ValidationError("username must be at least 6 characters long");
  }
}
