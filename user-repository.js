import DBLocal from "db-local";
const { Schema } = new DBLocal({ path: "./db" });
import { randomUUID } from "crypto";
import { ValidationError } from "./errors.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./config.js";

const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const validatePassword = (password) => {
  if (typeof password !== "string")
    throw new ValidationError("password must be a string");
  if (password.length < 6)
    throw new ValidationError("password must be at least 6 characters long");
};

const validateUsername = (username) => {
  if (typeof username !== "string") ç("username must be a string");
  if (username.length < 3)
    throw new ValidationError("username must be at least 6 characters long");

  const user = User.findOne({ username });
  if (user) throw new ValidationError("username already exists");
};

//Optionally you can use Zod for validating the data
export default class UserRepository {
  static async create({ username, password }) {
    validatePassword(password);
    validateUsername(username);

    const id = randomUUID(); // Depending on the db using this is not a good idea because it makes it slower

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    User.create({
      _id: id,
      username,
      password: hashedPassword,
    }).save();

    return id;
  }

  static login({ username, password }) {}
}
