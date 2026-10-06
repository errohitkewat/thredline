import { Router } from "express";
import { authenticate, validateSeller } from "../middleware/auth.middleware.js";
import multer from "multer";
import { parseDataIntoJson } from "../middleware/data.middleware.js";
import { createProductController, deleteProduct, getSingleProduct, listAllProducts, listAllPublishedProducts, listProductController, unListProductController, updateProduct } from "../controller/product.controller.js";
import { createProductValidator, updateProductValidator } from "../validators/product.validator.js";
import { validateReq } from "../middleware/validate.middleware.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 7,
        fileSize: 2 * 1024 * 1024,
    }
})



const productRoutes = Router();


/* 
    @method -> POST
    @route -> /api/products/
    @description -> creates the product and saves the images of the product into images kit 
    @red.body -> { title, description, price: { amount: 499, currency: "INR" }, sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 15 }]}
*/
productRoutes.post(
    "/",
    authenticate,
    validateSeller,
    upload.array("images"),
    parseDataIntoJson,
    createProductValidator,
    validateReq,
    createProductController
);





/* 
    @method -> GET
    @route -> /api/products/
    @description -> list all the published products to the user it does not need to be authenticated
    @access -> everyone
*/
productRoutes.get("/", listAllPublishedProducts);





/* 
    @method -> GET
    @route -> /api/products/seller
    @description -> list all products to the seller it needs to be authenticated and authorized access this api is not accessble for a normal user 
    @access -> only seller,
*/
productRoutes.get("/seller", authenticate, validateSeller, listAllProducts);





/* 
    @method -> GET
    @route -> /api/products/:id
    @description -> gets a single product by product id
    @access -> everyone
*/
productRoutes.get("/:id", getSingleProduct);






/* 
    @method -> DELETE
    @route -> /api/products/:id
    @description -> delete a single product by the product id this api can be accessible for only seller
    @access -> seller only
*/
productRoutes.delete("/:id", authenticate, validateSeller, deleteProduct);





/* 
    @method -> PUT
    @route -> /api/products/:id
    @description -> updates a single product by the product id this api can be accessible for only seller
    @access -> seller only
*/
productRoutes.put(
    "/:id",
    authenticate,
    validateSeller,
    upload.array("images"),
    parseDataIntoJson,
    updateProductValidator,
    validateReq,
    updateProduct
);






/* 
  @method -> PATCH
  @route -> /api/products/unlist/:id
  @description -> Unlist a product by its id
  @access -> seller
*/
productRoutes.patch("/unlist/:id", authenticate, validateSeller, unListProductController);






/* 
  @method -> PATCH
  @route -> /api/products/list/:id
  @description -> list a product by its id
  @access -> seller
*/
productRoutes.patch("/list/:id", authenticate, validateSeller, listProductController);







export default productRoutes;