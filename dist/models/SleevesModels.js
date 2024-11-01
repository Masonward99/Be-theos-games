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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSleeves = findSleeves;
exports.addSleeve = addSleeve;
exports.findSleeve = findSleeve;
exports.removeSleeve = removeSleeve;
exports.findSleeveReviews = findSleeveReviews;
exports.addSleeveReview = addSleeveReview;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
function findSleeves() {
    return __awaiter(this, void 0, void 0, function* () {
        let sleeves = yield db_1.default.query(`SELECT sleeves.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews
     FROM sleeves
     LEFT JOIN reviews ON (sleeves.sleeve_id = reviews.entity_id AND reviews.entity_type = 'sleeves')
     GROUP BY sleeves.sleeve_id;`);
        return sleeves.rows;
    });
}
function addSleeve(name, description, price, stock, height, width, pack_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let sleeve = yield db_1.default.query(`INSERT INTO sleeves 
    (sleeve_name, description, price, stock, height, width, pack_size)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;`, [name, description, price, stock, height, width, pack_size]);
        return sleeve.rows[0];
    });
}
function findSleeve(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('sleeves', 'sleeve_id', [id]);
        let sleeve = yield db_1.default.query(`SELECT sleeves.*, avg(reviews.rating) AS average_review, count(reviews.rating) AS num_reviews
     FROM sleeves
     LEFT JOIN reviews ON (sleeves.sleeve_id = reviews.entity_id AND reviews.entity_type = 'sleeves')
     WHERE sleeves.sleeve_id = $1
     GROUP BY sleeves.sleeve_id
     ;`, [id]);
        return sleeve.rows[0];
    });
}
function removeSleeve(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('sleeves', 'sleeve_id', [id]);
        let sleeve = yield db_1.default.query('DELETE FROM sleeves WHERE sleeve_id = $1 RETURNING *', [id]);
        yield (0, utils_1.deleteEntityReviews)(id, 'sleeves');
        return sleeve.rows[0];
    });
}
function findSleeveReviews(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('sleeves', 'sleeve_id', [id]);
        let reviews = yield db_1.default.query(`SELECT * FROM reviews WHERE (entity_type = 'sleeves' AND entity_id = $1);`, [id]);
        return reviews.rows;
    });
}
function addSleeveReview(id, rating, author, body, created_at, review_title) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkExists)('sleeves', 'sleeve_id', [id]);
        let review = yield db_1.default.query(`INSERT INTO reviews 
    (entity_type, entity_id, rating, author, review_body, review_title, created_at)
    VALUES('sleeves', $1,$2,$3,$4,$5, $6)
    RETURNING *;`, [id, rating, author, body, review_title, created_at]);
        return review.rows[0];
    });
}
