import express from "express";
import { RegisterUser } from '../handlers/RegisterHandler';
import { LoginUser} from '../handlers/LoginHandler';
import {LogoutUser} from "../handlers/LogoutHandler.ts";

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/logout', LogoutUser);

export default router;