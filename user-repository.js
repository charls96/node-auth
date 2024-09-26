import DBLocal from "db-local";
const { Schema } = new DBLocal({ path: "./db" });
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./config.js";
import Validation from "./validations.js";
import { LoginError, ValidationError } from "./errors.js";

export const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

//Optionally you can use Zod for validating the data
export default class UserRepository {
  static async create({ username, password }) {
    Validation.password(password);
    Validation.username(username);

    const user = User.findOne({ username });
    if (user) throw new ValidationError("username already exists");

    const id = randomUUID(); // Depending on the db using this is not a good idea because it makes it slower

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    User.create({
      _id: id,
      username,
      password: hashedPassword,
    }).save();

    return id;
  }

  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });
    if (!user) throw new LoginError("username or password is incorrect");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new LoginError("username or password is incorrect");

    const { password: _password, ...publicUser } = user;

    return publicUser;
  }
}
