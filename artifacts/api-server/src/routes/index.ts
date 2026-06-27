import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import ordersRouter from "./orders";
import authRouter from "./auth";
import usersRouter from "./users";
import analyticsRouter from "./analytics";
import aiRouter from "./ai";
import emailRouter from "./email";
import messagesRouter from "./messages";
import financesRouter from "./finances";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/portfolio", portfolioRouter);
router.use("/orders", ordersRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/analytics", analyticsRouter);
router.use("/ai", aiRouter);
router.use("/email", emailRouter);
router.use("/messages", messagesRouter);
router.use("/finances", financesRouter);

export default router;
