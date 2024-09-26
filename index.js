import express from "express";
import { PORT } from "./config.js";
import UserRepository from "./user-repository.js";
import { getErrorFormatted } from "./errors.js";

const app = express();
app.use(express.json());

app.set("view engine", "ejs");

// ### REGION: GET
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/protected", (req, res) => {});
// ### END REGION

// ### REGION: POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    res.send({ user });
  } catch (error) {
    const errorFormatted = getErrorFormatted(error);

    res
      .status(errorFormatted.statusCode)
      .send({ error: errorFormatted.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    const errorFormatted = getErrorFormatted(error);

    res
      .status(errorFormatted.statusCode)
      .send({ error: errorFormatted.message });
  }
});

app.post("/logout", (req, res) => {});
// ### END REGION

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
