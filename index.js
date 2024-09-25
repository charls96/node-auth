import express from "express";
import { PORT } from "./config.js";

const app = express();

// ### REGION: GET
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/protected", (req, res) => {});

// ### END REGION

// ### REGION: POST

app.post("/login", (req, res) => {});
app.post("/register", (req, res) => {});
app.post("/logout", (req, res) => {});

// ### END REGION

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
