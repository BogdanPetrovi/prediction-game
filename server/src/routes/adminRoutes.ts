import { Router } from "express";
import { adminMatches, eventUpsert, searchEvent, searchParentEvent, updateMatches } from "../controllers/adminController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/matches", isLoggedIn, isAdmin, adminMatches)

router.post("/matches", isLoggedIn, isAdmin, updateMatches)

router.get("/search-event", isLoggedIn, isAdmin, searchEvent)

router.get("/search-parent-event", isLoggedIn, isAdmin, searchParentEvent)

router.post("/event-upsert", isLoggedIn, isAdmin, eventUpsert)

export default router