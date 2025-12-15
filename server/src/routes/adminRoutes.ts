import { Router } from "express";
import { addTournament } from "../controllers/adminController.js";

const router = Router();

router.post('/admin/addTournament/:id', addTournament)

export default router