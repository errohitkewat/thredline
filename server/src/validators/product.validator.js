import { body } from "express-validator";


const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const createProductValidator = [
    body("title")
        .exists({ checkFalsy: true }).withMessage("Title is required").bail()
        .isString().withMessage("Title must be a string value").bail()
        .trim()
        .isLength({ min: 10, max: 100 }).withMessage("Title must be between 10 - 100 characters long"),

    body("description")
        .exists().withMessage("Description is required").bail()
        .isString().withMessage("Description must be a string value").bail()
        .trim()
        .isLength({ min: 20, max: 500 }).withMessage("Description must be between 20 to 500 characters long").bail(),

    body("price")
        .exists({ checkFalsy: true }).withMessage("Price is required").bail()
        .isObject().withMessage("Price must be an object").bail(),

    body("price.amount")
        .exists({ checkFalsy: true }).withMessage("Amount is required").bail()
        .isFloat({ min: 0.01 }).withMessage("Price amount must be greater than 0").toFloat(),

    body("price.currency")
        .exists({ checkFalsy: true }).withMessage("Currency is required").bail()
        .isString().withMessage("Currency must be a string value").bail()
        .isIn(["INR", "USD"]).withMessage("Currency either be INR or USD"),

    body("sizes")
        .exists({ checkFalsy: true }).withMessage("Sizes are required").bail()
        .isArray({ min: 1, max: ALLOWED_SIZES.length }).withMessage(`Sizes must contain between 1 and ${ALLOWED_SIZES.length} entries`).bail(),

    body("sizes.*")
        .isObject().withMessage("Each size entry must be an object").bail(),

    body("sizes.*.size")
        .exists({ checkFalsy: true }).withMessage("Size must be present in every entry os sizes array").bail()
        .isString().withMessage("Size must be a string value").bail()
        .isIn(ALLOWED_SIZES).withMessage(`Size must be one of: ${ALLOWED_SIZES.join(", ")}`),

    body("sizes.*.stock")
        .exists({ checkFalsy: true }).withMessage("Stock is required").bail()
        .isInt({ min: 0 }).withMessage("Stock must be non-negative and integer value"),
]




export const updateProductValidator = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string value")
    .bail()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be between 10 - 100 characters long"),

  body("description")
    .exists()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string value")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be between 20 to 500 characters long"),

  body("price")
    .exists({ checkFalsy: true })
    .withMessage("Price is required")
    .bail()
    .isObject()
    .withMessage("Price must be an object"),

  body("price.amount")
    .exists({ checkFalsy: true })
    .withMessage("Amount is required")
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage("Price amount must be greater than 0")
    .toFloat(),

  body("price.currency")
    .exists({ checkFalsy: true })
    .withMessage("Currency is required")
    .bail()
    .isString()
    .withMessage("Currency must be a string value")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be either INR or USD"),

  body("sizes")
    .exists({ checkFalsy: true })
    .withMessage("Sizes are required")
    .bail()
    .isArray({ min: 1, max: ALLOWED_SIZES.length })
    .withMessage(
      `Sizes must contain between 1 and ${ALLOWED_SIZES.length} entries`,
    ),

  body("sizes.*").isObject().withMessage("Each size entry must be an object"),

  body("sizes.*.size")
    .exists({ checkFalsy: true })
    .withMessage("Size must be present in every size entry")
    .bail()
    .isString()
    .withMessage("Size must be a string value")
    .bail()
    .isIn(ALLOWED_SIZES)
    .withMessage(`Size must be one of: ${ALLOWED_SIZES.join(", ")}`),

  body("sizes.*.stock")
    .exists({ checkFalsy: true })
    .withMessage("Stock is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("existingImageIds")
    .exists()
    .withMessage("Existing image IDs are required")
    .bail()
    .isArray()
    .withMessage("Existing image IDs must be an array"),

  body("existingImageIds.*")
    .isString()
    .withMessage("Each image ID must be a string"),
];
