import { Router } from "express";
import { getEvent, getHistory, getLastLeaderboardUpdateAt, getLeaderboard, getMatches, getPredictions, getRecentPredictions, getUsersLeaderboardPlaceAndPage, predict } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

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

export default router