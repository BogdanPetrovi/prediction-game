import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { getMatches, getMatchesPoints } from "../controllers/matchController.js";
import { getLastLeaderboardUpdateAt, getLeaderboard, getUsersLeaderboardPlaceAndPage, prizes } from "../controllers/leaderboardController.js";
import { getPredictions, getPredictionsHistory, getUserPredictionsHistory, predict } from "../controllers/predictionController.js";
import { getHistory } from "../controllers/historyController.js";
import { getParentEvent } from "../controllers/eventController.js";
import { changeUsername, getProfile, getUserProfile, getUsername } from "../controllers/userController.js";

const router = Router();

router.get('/matches', isLoggedIn, getMatches)

router.get('/leaderboard', isLoggedIn, getLeaderboard)

router.get('/event', isLoggedIn, getParentEvent)

router.get('/history', isLoggedIn, getHistory)

router.post('/predict', isLoggedIn, predict)

router.get('/predictions', isLoggedIn, getPredictions)

router.get('/users-ledaerboard-page', isLoggedIn, getUsersLeaderboardPlaceAndPage)

router.get('/leaderboard-last-update-at', isLoggedIn, getLastLeaderboardUpdateAt)

router.get('/matches-points', isLoggedIn, getMatchesPoints)

router.get('/profile', isLoggedIn, getProfile)

router.get('/profile/username', isLoggedIn, getUsername)

router.put('/profile/username', isLoggedIn, changeUsername)

router.get('/prediction-history', isLoggedIn, getPredictionsHistory)

router.get('/users/:username/profile', isLoggedIn, getUserProfile)

router.get('/users/:username/prediction-history', isLoggedIn, getUserPredictionsHistory)

router.get('/prizes', isLoggedIn, prizes)

export default router