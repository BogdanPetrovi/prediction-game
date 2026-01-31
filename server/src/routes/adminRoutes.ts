import { Router } from "express";
import { addEvent } from "../controllers/adminController.js";

const router = Router();

router.post('/addEvent/:id', addEvent)

export default router