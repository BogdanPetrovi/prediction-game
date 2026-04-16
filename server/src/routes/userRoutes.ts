import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { getMatches, getVotesPrecentage } from "../controllers/matchController.js";
import { getLastLeaderboardUpdateAt, getLeaderboard, getUsersLeaderboardPlaceAndPage } from "../controllers/leaderboardController.js";
import { getPredictions, getPredictionsHistory, predict } from "../controllers/predictionController.js";
import { getHistory } from "../controllers/historyController.js";
import { getEvent } from "../controllers/eventController.js";
import { getProfile } from "../controllers/userController.js";

const router = Router();

router.get('/matches', isLoggedIn, getMatches)

router.get('/leaderboard', isLoggedIn, getLeaderboard)

router.get('/event', isLoggedIn, getEvent)

router.get('/history', isLoggedIn, getHistory)

router.post('/predict', isLoggedIn, predict)

router.get('/predictions', isLoggedIn, getPredictions)

router.get('/users-ledaerboard-page', isLoggedIn, getUsersLeaderboardPlaceAndPage)

router.get('/leaderboard-last-update-at', isLoggedIn, getLastLeaderboardUpdateAt)

router.get('/votes-precentages', isLoggedIn, getVotesPrecentage)

router.get('/profile', isLoggedIn, getProfile)

router.get('/prediction-history', isLoggedIn, getPredictionsHistory)

export default router