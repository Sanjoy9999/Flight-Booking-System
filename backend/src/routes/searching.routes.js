import express from "express";
import { searchFlights } from "../controllers/Searching.Controller.js";

const searchRouter = express.Router();

searchRouter.post("/", searchFlights);

export default searchRouter;
