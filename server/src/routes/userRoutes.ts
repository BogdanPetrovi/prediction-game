import { Router } from "express";
import { getMatches } from "../controllers/userController.js";

const router = Router();

router.get('/matches', getMatches)

export default router