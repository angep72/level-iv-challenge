"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMongoIdParam = exports.validateBooking = exports.validateEvent = exports.validateLogin = exports.validateRegister = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    return next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateRegister = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 6 }),
    (0, express_validator_1.body)("firstName").trim().isLength({ min: 2 }),
    (0, express_validator_1.body)("lastName").trim().isLength({ min: 2 }),
    (0, express_validator_1.body)("role").optional().isIn(["customer", "admin"]),
    exports.handleValidationErrors,
];
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
    exports.handleValidationErrors,
];
exports.validateEvent = [
    (0, express_validator_1.body)("title").trim().isLength({ min: 3 }),
    (0, express_validator_1.body)("description").trim().isLength({ min: 10 }),
    (0, express_validator_1.body)("date").isISO8601(),
    (0, express_validator_1.body)("location").trim().isLength({ min: 3 }),
    (0, express_validator_1.body)("capacity").isInt({ min: 1 }),
    (0, express_validator_1.body)("price").isFloat({ min: 0 }),
    exports.handleValidationErrors,
];
exports.validateBooking = [
    (0, express_validator_1.body)("event_id").isMongoId().withMessage("Invalid event ID"),
    exports.handleValidationErrors,
];
exports.validateMongoIdParam = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid ID format"),
    exports.handleValidationErrors,
];
//# sourceMappingURL=validation.js.map