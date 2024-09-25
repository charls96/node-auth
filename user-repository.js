import DBLocal from "db-local";
const { Schema } = new DBLocal({ path: "./db" });
import { randomUUID } from "crypto";

const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const validatePassword = (password) => {
  if (typeof password !== "string")
    throw new Error("password must be a string");
  if (password.length < 6)
    throw new Error("password must be at least 6 characters long");
};

const validateUsername = (username) => {
  if (typeof username !== "string")
    throw new Error("username must be a string");
  if (username.length < 3)
    throw new Error("username must be at least 6 characters long");

  const user = User.findOne({ username });
  if (user) throw new Error("username already exists");
};

//Optionally you can use Zod for validating the data
export default class UserRepository {
  static create({ username, password }) {
    validatePassword(password);
    validateUsername(username);

    const id = randomUUID(); // Depending on the db using this is not a good idea because it makes it slower

    User.create({ _id: id, username, password }).save();

    return id;
  }

  static login({ username, password }) {}
}

//TODO create an error class to give more context to the errors
