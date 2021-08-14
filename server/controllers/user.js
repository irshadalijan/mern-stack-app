import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await User.findOne({ email });
    if (!userData)
      return res.status(400).json({ message: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword)
      return res.send(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { email: userData.email, id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: userData, token });
  } catch (error) {
    res.send(500).json({ message: "Error occurred." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const userData = await User.findOne({ email });
    if (userData)
      return res.status(400).json({ message: "Email already exists" });
    if (password !== confirmPassword)
      return res.send(400).json({ message: "Passwords are not matching" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      "secretKeyStr",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.send(500).json({ message: "Error occurred." });
  }
};
