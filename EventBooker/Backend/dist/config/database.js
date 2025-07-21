"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:3000/booking';
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected successfully');
        return true;
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        return false;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('📴 MongoDB disconnected');
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
mongoose_1.default.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('🚨 Mongoose connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});
process.on('SIGINT', async () => {
    await (0, exports.disconnectDatabase)();
    process.exit(0);
});
//# sourceMappingURL=database.js.map