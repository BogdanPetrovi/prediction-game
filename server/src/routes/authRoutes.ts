import { Router } from "express";
import passport from "passport";
import { getUser } from "../controllers/authController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = Router();

router.get("/auth/discord", passport.authenticate('discord'))

router.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: 'http://localhost:3000/play',
  failureRedirect: 'http://localhost:3000/login'
}))

router.get("/me", isLoggedIn, getUser);

export default router