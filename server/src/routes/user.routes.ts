import express from "express";
import {getProfileData} from "../handlers/ProfileHandler.ts";

const router = express.Router();

router.get('/:userId', getProfileData);

export default router;