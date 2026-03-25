import { Router } from "express";
import { addEvent, adminMatches, updateMatches } from "../controllers/adminController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.post('/addEvent', addEvent)

router.get("/matches", isLoggedIn, isAdmin, adminMatches)

router.post("/matches", isLoggedIn, isAdmin, updateMatches)

export default router