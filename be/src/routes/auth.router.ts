import authController from "@controllers/auth.controller";
import express from "express";
import validationMiddleware, {
  ValidationMiddleware,
} from "@middlewares/validation.middleware";
import ExceptionHandler from "@utils/asyncHandler";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validationMiddleware.register,
  ValidationMiddleware,
  ExceptionHandler(authController.register)
);

authRouter.post(
  "/login",
  validationMiddleware.login,
  ValidationMiddleware,
  ExceptionHandler(authController.login)
);

authRouter.post("/refresh", ExceptionHandler(authController.refreshToken));

authRouter.post("/logout", ExceptionHandler(authController.logout));

export default authRouter;
