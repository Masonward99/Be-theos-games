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
exports.checkCategoryInUse = exports.checkExists = void 0;
exports.checkAllCategoriesExist = checkAllCategoriesExist;
exports.addAllCategoriesToGames = addAllCategoriesToGames;
const db_1 = __importDefault(require("./db"));
const pg_format_1 = __importDefault(require("pg-format"));
const checkExists = (tableName, columnName, valueArray) => __awaiter(void 0, void 0, void 0, function* () {
    const queryStr = (0, pg_format_1.default)("SELECT * FROM %I WHERE %I = $1;", tableName, columnName);
    const dbOutput = yield db_1.default.query(queryStr, valueArray);
    if (dbOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found" });
    }
});
exports.checkExists = checkExists;
const checkCategoryInUse = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield db_1.default.query('Select * FROM categories WHERE category_name = $1', [categoryName]);
    return !(category.rows.length == 0);
});
exports.checkCategoryInUse = checkCategoryInUse;
function checkAllCategoriesExist(categories) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const categoryName of categories) {
            const exist = yield (0, exports.checkCategoryInUse)(categoryName);
            if (!exist) {
                throw new Error("category does not exist");
            }
        }
    });
}
function addAllCategoriesToGames(categories, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index in categories) {
            yield db_1.default.query(`INSERT INTO games_categories (game_id, category_name) VALUES ($1, $2);`, [game_id, categories[index]]);
        }
        let game = yield db_1.default.query(`SELECT games.*, avg(reviews.rating) AS average_review, ARRAY_AGG(DISTINCT games_categories.category_name) AS categories, 
          count(DISTINCT reviews.review_id) AS num_reviews FROM games 
          LEFT JOIN reviews ON (games.game_id = reviews.entity_id AND reviews.entity_type = 'games')
          LEFT JOIN games_categories ON (games.game_id = games_categories.game_id)
          WHERE games.game_id = $1
          GROUP BY games.game_id ;`, [game_id]);
        return game;
    });
}
