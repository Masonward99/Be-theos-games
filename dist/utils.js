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
