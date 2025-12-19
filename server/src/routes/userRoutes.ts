import { Router } from "express";
import { getEvent, getLeaderboard, getMatches } from "../controllers/userController.js";

const router = Router();

router.get('/matches', getMatches)

router.get('/leaderboard', getLeaderboard)

router.get('/event', getEvent)

export default router