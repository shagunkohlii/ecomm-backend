const express = require("express");
const USER = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await USER.findOne({ email });
    // find user is already existed..
    if (existingUser) {
      return res.status(400).json({ error: "user is already existed" });
    }


    const datauser = await USER.create({
      fullName,
      email,
      password
    });
    console.log(datauser);
    return res
      .status(200)
      .json({ message: "user created successfully", datauser });
  } catch (error) {
    console.error("error creating user", error);
    return res.status(500).json({ error: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);
    // console.log(token,"token generated at time login")
    return res.cookie("token", token).json({ message: "token created", token });
  } catch (error) {
    res.json({ error: "Incorrect email or password" });
  }
});



module.exports = router;
