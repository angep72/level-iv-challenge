"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("../src/config/database");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        const dbConnected = await (0, database_1.connectDatabase)();
        if (!dbConnected) {
            console.error('Failed to connect to database');
            process.exit(1);
        }
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map