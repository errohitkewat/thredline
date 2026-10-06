import { body } from "express-validator";


export const createUserValidator = [
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string").bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Name must be minimum 3 characters long and maximum 50 characters long"),

    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("Email must be string value").bail()
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Please enter a valid email"),

    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string value").bail()
        .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter").bail()
        .matches(/[0-9]/).withMessage("Password must contain a number").bail()
        .isLength({ min: 6, max: 128 }).withMessage("password must be minimum 6 characters long"),

    body("confirmPassword")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string value").bail()
        .isLength({ min: 6 }).withMessage("password must be minimum 6 characters long").bail()
        .custom((value, { req }) => { 
            if (value !== req.body.password) { 
                throw new Error("Password do not match");
            }
            return true;
        }),
]



export const loginUserValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a string value").bail()
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Please enter a valid email"),

    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string value").bail()
        .isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
]
