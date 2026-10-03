import { Router } from "express";
import { addMatch, addPrize, adminMatches, eventUpsert, manualCalculation, matchesWithoutResult, pendingNotifications, removeParentEvent, searchEvent, searchParentEvent, sendNotifications, setResult, updateMatches } from "../controllers/adminController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getEvent } from "../controllers/eventController.js";

const router = Router();

router.get("/matches", isLoggedIn, isAdmin, adminMatches)

router.post("/matches", isLoggedIn, isAdmin, updateMatches)

router.get("/search-event", isLoggedIn, isAdmin, searchEvent)

router.get("/search-parent-event", isLoggedIn, isAdmin, searchParentEvent)

router.post("/event-upsert", isLoggedIn, isAdmin, eventUpsert)

router.post("/manual-calculation", isLoggedIn, isAdmin, manualCalculation)

router.post("/add-prize", isLoggedIn, isAdmin, addPrize)

router.post("/add-match", isLoggedIn, isAdmin, addMatch)

router.get("/pending-notifications", isLoggedIn, isAdmin, pendingNotifications)

router.post("/send-notifications", isLoggedIn, isAdmin, sendNotifications)

router.get("/matches-without-result", isLoggedIn, isAdmin, matchesWithoutResult)

router.post("/set-result", isLoggedIn, isAdmin, setResult)

router.get('/child-event', isLoggedIn, isAdmin, getEvent)

router.post('/remove-parent-event', isLoggedIn, isAdmin, removeParentEvent)

export default router