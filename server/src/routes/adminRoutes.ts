import { Router } from "express";
import { addPrize, adminMatches, eventUpsert, manualCalculation, parentEvent, removeParentEvent, searchEvent, searchParentEvent, updateMatches } from "../controllers/adminController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/matches", isLoggedIn, isAdmin, adminMatches)

router.post("/matches", isLoggedIn, isAdmin, updateMatches)

router.get("/search-event", isLoggedIn, isAdmin, searchEvent)

router.get("/search-parent-event", isLoggedIn, isAdmin, searchParentEvent)

router.post("/event-upsert", isLoggedIn, isAdmin, eventUpsert)

router.post("/manual-calculation", isLoggedIn, isAdmin, manualCalculation)

router.post("/add-prize", isLoggedIn, isAdmin, addPrize)

router.get('/parent-event', isLoggedIn, isAdmin, parentEvent)

router.post('/remove-parent-event', isLoggedIn, isAdmin, removeParentEvent)

export default router