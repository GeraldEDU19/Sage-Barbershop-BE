import { Request, Response } from "express";
import * as userService from "../services/userService";
import { jwtService } from "../services/jwtService";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatches = await userService.comparePassword(
      password,
      user.password
    );

    if (!passwordMatches) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    user.password = "";
    const token = jwtService.createTokenFromString(JSON.stringify(user), "1h");

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function register(req: Request, res: Response): Promise<void> {

  if (req.body.birthdate) req.body.birthdate = new Date(req.body.birthdate);

  if (!req.body.name || !req.body.email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
}
