import express from "express";
import {
  selectFlight,
  getSelectedFlight,
} from "../controllers/Select.Controller.js";

const selectRouter = express.Router();

selectRouter.post("/select", selectFlight);
selectRouter.get("/selected/:searchId", getSelectedFlight);

export default selectRouter;
