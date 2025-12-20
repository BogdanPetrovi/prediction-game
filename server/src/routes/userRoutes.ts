import { Router } from "express";
import { getEvent, getHistory, getLeaderboard, getMatches } from "../controllers/userController.js";

const router = Router();

router.get('/matches', getMatches)

router.get('/leaderboard', getLeaderboard)

router.get('/event', getEvent)

router.get('/history', getHistory)

export default router