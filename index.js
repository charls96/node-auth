import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PORT, SECRET_JWT_KEY } from "./config.js";
import UserRepository from "./user-repository.js";
import { getErrorFormatted } from "./errors.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

// ### REGION: MIDDLEWARES
app.use((req, res, next) => {
  const token = req.cookies.access_token;

  let data = null;

  req.session = { user: null };

  try {
    data = jwt.verify(token, SECRET_JWT_KEY);
    req.session.user = data;
  } catch {}

  next(); // pass control to the next route middleware
});
// ### END REGION

// ### REGION: GET
app.get("/", (req, res) => {
  const { user } = req.session;

  res.render("index", user);
});

app.get("/protected", (req, res) => {
  const { user } = req.session;

  if (!user) 
    return res.status(403).send("Access not authorized");

  res.render("protected", user);
});
// ### END REGION

// ### REGION: POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true, //Makes the cookie accessible only by the web server
        secure: process.env.NODE_ENV === "production", //Makes the cookie accessible only by HTTPS
        sameSite: "strict", //Makes the cookie accessible only by the same domain
        maxAge: 60 * 60 * 1000, //1 hour
      })
      .send({ user });
  } catch (error) {
    console.log(error.message);
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

app.post("/logout", (req, res) => {
  res
  .clearCookie("access_token")
  .json({ message: "Logout successful" })
  .redirect("/");
});
// ### END REGION

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
