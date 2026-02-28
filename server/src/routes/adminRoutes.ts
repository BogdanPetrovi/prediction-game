import { Router } from "express";
import { addEvent } from "../controllers/adminController.js";

const router = Router();

router.post('/addEvent', addEvent)

export default router