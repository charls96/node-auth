import express from "express";
import { PORT } from "./config.js";
import UserRepository from "./user-repository.js";

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

app.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    const id = UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    //TODO handle the error
    res.status(400).send({ error: error.message });
  }
});

app.post("/logout", (req, res) => {});
// ### END REGION

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
