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
exports.addUser = addUser;
exports.addAddress = addAddress;
exports.removeAddress = removeAddress;
exports.findAddresses = findAddresses;
exports.addOrder = addOrder;
const db_1 = __importDefault(require("../db"));
const utils_1 = require("../utils");
function addUser(username, password, email, dob, title, first_name, last_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield db_1.default.query(`INSERT INTO users (username, password, email, dob, title, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6,$7) 
        RETURNING username, email, dob, title, first_name, last_name;`, [username, password, email, dob, title, first_name, last_name,]);
        return data.rows[0];
    });
}
function addAddress(username, address_line1, postcode, city) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield db_1.default.query("INSERT INTO addresses (username, address_line1, postcode, city) VALUES ($1,$2,$3,$4) RETURNING *;", [username, address_line1, postcode, city]);
        return address.rows[0];
    });
}
function removeAddress(id, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield db_1.default.query('DELETE FROM addresses WHERE (username = $1 AND address_id = $2) RETURNING *;', [username, id]);
        if (address.rows.length == 0) {
            throw new Error('Address_id does not exist');
        }
        return address.rows[0];
    });
}
function findAddresses(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const addresses = yield db_1.default.query("SELECT * FROM addresses WHERE username = $1", [username]);
        return addresses.rows;
    });
}
function addOrder(username, games, sleeves, address_id, date) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('called');
        const order = yield db_1.default.query(`INSERT INTO orders 
        (username, address_id, date)
        VALUES ($1, $2, $3)
        RETURNING *`, [username, address_id, date]);
        let order_id = order.rows[0].order_id;
        console.log(order_id);
        yield (0, utils_1.insertOrderItems)(order_id, games, 'games');
    });
}
