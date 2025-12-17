import { Router } from "express";
import { getLeaderboard, getMatches } from "../controllers/userController.js";

const router = Router();

router.get('/matches', getMatches)

router.get('/get-leaderboard', getLeaderboard)

export default router