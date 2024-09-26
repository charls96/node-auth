import express from "express";
import { PORT } from "./config.js";
import UserRepository from "./user-repository.js";
import { getErrorFormatted } from "./errors.js";

const app = express();
app.use(express.json());

// ### REGION: GET
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/protected", (req, res) => {});
// ### END REGION

// ### REGION: POST
app.post("/login", (req, res) => {});

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
