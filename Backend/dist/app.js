"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const religion_routes_1 = __importDefault(require("./routes/religion.routes"));
const cast_routes_1 = __importDefault(require("./routes/cast.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Replace with the actual front-end URL
    credentials: true, // This allows cookies to be sent along with the request
}));
app.use((0, cookie_parser_1.default)());
// routes
app.use("/api/v1/religion", religion_routes_1.default);
app.use("/api/v2/cast", cast_routes_1.default);
app.get("/", (req, res) => {
    res.send("Working");
});
exports.default = app;
