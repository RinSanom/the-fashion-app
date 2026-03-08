"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware = {
    // register validation
    register: [
        (0, express_validator_1.body)("firstName")
            .trim()
            .notEmpty()
            .withMessage("First name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("First name must be between 2 and 50 characters"),
        (0, express_validator_1.body)("lastName")
            .trim()
            .notEmpty()
            .withMessage("Last name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("Last name must be between 2 and 50 characters"),
        (0, express_validator_1.body)("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address")
            .normalizeEmail(),
        (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        (0, express_validator_1.body)("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password is required")
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
        (0, express_validator_1.body)("gender")
            .optional()
            .isIn(["male", "female", "not_specified"])
            .withMessage("Gender must be male, female, or not_specified"),
        (0, express_validator_1.body)("role")
            .optional()
            .isIn(["user", "admin"])
            .withMessage("Role must be user or admin"),
    ],
    // login validation
    login: [
        (0, express_validator_1.body)("email")
            .optional()
            .trim()
            .isEmail()
            .withMessage("Invalid email address")
            .normalizeEmail(),
        (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    OTP_ctr_sendMailVerificationCode: [
        (0, express_validator_1.body)("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address")
            .normalizeEmail(),
    ],
    OTP_ctr_verifyCode: [
        (0, express_validator_1.body)("code")
            .trim()
            .notEmpty()
            .withMessage("Verification code is required")
            .isString()
            .withMessage("Verification code must be a string"),
    ],
    addWishlists: [
        (0, express_validator_1.body)("productId")
            .trim()
            .notEmpty()
            .withMessage("productId is required")
            .isMongoId()
            .withMessage("Invalid productId"),
        (0, express_validator_1.body)("variantId")
            .trim()
            .notEmpty()
            .withMessage("variantId is required")
            .isMongoId()
            .withMessage("Invalid variantId"),
    ],
    removeWishlists: [
        (0, express_validator_1.param)("productId")
            .trim()
            .notEmpty()
            .withMessage("productId is required")
            .isMongoId()
            .withMessage("Invalid productId"),
    ],
};
const ValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array().map((err) => ({
            field: err.path || err.param,
            message: err.msg,
        }));
        res.status(400).send({
            message: "Validation failed",
            errors: errorArray,
        });
        return;
    }
    next();
};
exports.ValidationMiddleware = ValidationMiddleware;
exports.default = validationMiddleware;
