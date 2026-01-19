import { Router } from "express";
import { getEvent, getHistory, getLeaderboard, getMatches, getPredictions, predict } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = Router();

router.get('/matches', getMatches)

router.get('/leaderboard', getLeaderboard)

router.get('/event', getEvent)

router.get('/history', getHistory)

router.post('/predict', isLoggedIn, predict)

router.get('/predictions', isLoggedIn, getPredictions)

export default router