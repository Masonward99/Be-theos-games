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
const http_1 = __importDefault(require("http"));
const db_js_1 = __importDefault(require("./db.js"));
const hostname = '127.0.0.1';
const port = 3000;
const server = http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.url === '/data') {
        try {
            const result = yield db_js_1.default.query('SELECT * FROM categories');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.rows));
        }
        catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end('Database error');
        }
    }
    else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}));
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
