import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { getMatches, getVotesPrecentage } from "../controllers/matchController.js";
import { getLastLeaderboardUpdateAt, getLeaderboard, getUsersLeaderboardPlaceAndPage } from "../controllers/leaderboardController.js";
import { getPredictions, getRecentPredictions, predict } from "../controllers/predictionController.js";
import { getHistory } from "../controllers/historyController.js";
import { getEvent } from "../controllers/eventController.js";

const router = Router();

router.get('/matches', isLoggedIn, getMatches)

router.get('/leaderboard', isLoggedIn, getLeaderboard)

router.get('/event', isLoggedIn, getEvent)

router.get('/history', isLoggedIn, getHistory)

router.post('/predict', isLoggedIn, predict)

router.get('/predictions', isLoggedIn, getPredictions)

router.get('/recent-predictions', isLoggedIn, getRecentPredictions)

router.get('/users-ledaerboard-page', isLoggedIn, getUsersLeaderboardPlaceAndPage)

router.get('/leaderboard-last-update-at', isLoggedIn, getLastLeaderboardUpdateAt)

router.get('/votes-precentages', isLoggedIn, getVotesPrecentage)

export default router