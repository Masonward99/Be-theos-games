"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SleevesControllers_1 = require("../controllers/SleevesControllers");
const sleevesRouter = express_1.default.Router();
sleevesRouter.route('/')
    .get(SleevesControllers_1.getSleeves)
    .post(SleevesControllers_1.postSleeve);
sleevesRouter.route('/:sleeve_id')
    .get(SleevesControllers_1.getSleeve)
    .delete(SleevesControllers_1.deleteSleeve);
sleevesRouter.route('/:sleeve_id/reviews')
    .get(SleevesControllers_1.getSleeveReviews)
    .post(SleevesControllers_1.postSleeveReview);
exports.default = sleevesRouter;
