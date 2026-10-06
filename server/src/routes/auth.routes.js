import { Router } from "express";
import { createUserValidator, loginUserValidator } from "../validators/auth.validator.js";
import { validateReq } from "../middleware/validate.middleware.js"
import { getMeController, loginUserController, logOutUserController, refreshTokensController, registerUserController } from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js"




const authRoutes = Router();



/* 
    @method -> POST
    @route -> /api/auth/register
    @description -> register a user and saves into the data base
    @req.body -> { name, email, password, confirmPassword } 
*/
authRoutes.post("/register", createUserValidator, validateReq, registerUserController);




/* 
    @method -> POST
    @route -> /api/auth/login
    @description -> Login a registered user 
    @req.body -> { email, password } 
*/
authRoutes.post("/login", loginUserValidator, validateReq, loginUserController);




/* 
    @method -> Get
    @route -> /api/auth/me
    @description -> gets the details of the LoggedIn user
    @req.headers.authorization = Bearer accessToken
*/
authRoutes.get("/me", authenticate, getMeController);




/* 
    @method -> POST
    @route -> /api/auth/refresh
    @description -> refresh the tokens and return and saves the new generated tokens 
    @req.cookies = refreshToken
*/
authRoutes.post("/refresh", refreshTokensController);





/* 
    @method -> POST
    @route -> /api/auth/logout
    @description -> refresh the tokens and return and saves the new generated tokens 
    @req.cookies.refreshToken = refreshToken
*/
authRoutes.post("/logout", logOutUserController);





export default authRoutes;





