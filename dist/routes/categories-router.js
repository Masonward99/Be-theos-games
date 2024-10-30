"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoriesController_1 = require("../controllers/CategoriesController");
const categoriesRouter = express_1.default.Router();
categoriesRouter.route('/')
    .get(CategoriesController_1.getCategories)
    .post(CategoriesController_1.postCategory);
exports.default = categoriesRouter;
