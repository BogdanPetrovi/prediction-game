import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/auth/discord", passport.authenticate('discord'))

router.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: 'http://localhost:3000/',
  failureRedirect: '/auth/discord'
}))

export default router