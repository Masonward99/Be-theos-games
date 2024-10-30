"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.postCategory = postCategory;
const CategoriesModels_1 = require("../modles/CategoriesModels");
function getCategories(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield (0, CategoriesModels_1.findCategories)();
            return res.status(200).send({ categories });
        }
        catch (err) {
            next(err);
        }
    });
}
function postCategory(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { category_name, description } = req.body;
        try {
            const category = yield (0, CategoriesModels_1.addCategory)(category_name, description);
            return res.status(201).send({ category });
        }
        catch (err) {
            next(err);
        }
    });
}
