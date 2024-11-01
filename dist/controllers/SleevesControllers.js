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
exports.getSleeves = getSleeves;
exports.postSleeve = postSleeve;
exports.getSleeve = getSleeve;
exports.deleteSleeve = deleteSleeve;
exports.getSleeveReviews = getSleeveReviews;
exports.postSleeveReview = postSleeveReview;
const SleevesModels_1 = require("../models/SleevesModels");
function getSleeves(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sleeves = yield (0, SleevesModels_1.findSleeves)();
            res.status(200).send({ sleeves });
        }
        catch (err) {
            next(err);
        }
    });
}
function postSleeve(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sleeve_name, description, price, height, width, stock, pack_size } = req.body;
        try {
            let sleeve = yield (0, SleevesModels_1.addSleeve)(sleeve_name, description, price, stock, height, width, pack_size);
            res.status(201).send({ sleeve });
        }
        catch (err) {
            next(err);
        }
    });
}
function getSleeve(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sleeve_id } = req.params;
        try {
            let sleeve = yield (0, SleevesModels_1.findSleeve)(sleeve_id);
            res.status(200).send({ sleeve });
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteSleeve(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sleeve_id } = req.params;
        try {
            yield (0, SleevesModels_1.removeSleeve)(sleeve_id);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}
function getSleeveReviews(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sleeve_id } = req.params;
        try {
            let reviews = yield (0, SleevesModels_1.findSleeveReviews)(sleeve_id);
            res.status(200).send({ reviews });
        }
        catch (err) {
            next(err);
        }
    });
}
function postSleeveReview(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sleeve_id } = req.params;
        const { rating, author, review_body, created_at, review_title } = req.body;
        try {
            let review = yield (0, SleevesModels_1.addSleeveReview)(sleeve_id, rating, author, review_body, created_at, review_title);
            res.status(201).send({ review });
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    });
}
