import express from "express";
import {RetrieveSession} from "../handlers/SessionHandler.ts";

const router = express.Router();

router.get('/', RetrieveSession);

export default router;