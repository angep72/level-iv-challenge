"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../model/index");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET ?? "";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "1h";
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined.");
}
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role = "customer", } = req.body;
        const existingUser = await index_1.User.findOne({ email }).select("_id");
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new index_1.User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
        });
        const savedUser = await newUser.save();
        const token = jsonwebtoken_1.default.sign({
            userId: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
        }, jwtSecret, { expiresIn: jwtExpiresIn });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: savedUser._id,
                    email: savedUser.email,
                    firstName: savedUser.lastName,
                    lastName: savedUser.firstName,
                    role: savedUser.role,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await index_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map