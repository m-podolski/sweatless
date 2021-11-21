import { Router } from "express";
import passport from "passport";
import { permit } from "../middleware/authorization.js";
import { handleFiles } from "../middleware/fileUploads.js";
import {
  updateLogStatistics,
  recalcLogStatistics,
} from "../middleware/logStatistics.js";
import config from "../config/main.js";
import UserControllers from "../controllers/users.js";

const router = new Router();
const controllers = UserControllers();

let checkPermission;

switch (config.env.mode) {
  case "development":
    checkPermission = permit(true);
    break;
  case "production":
    checkPermission = permit("ADMIN");
    break;
  default:
    throw new Error("No valid environment mode");
}

router.route("/signin").post(controllers.signIn);
router.route("/refresh").get(controllers.refreshToken);

// router.use(passport.authenticate("jwt", { session: false }));

router.route("/signout").delete(controllers.signOut);

router
  .route("/")
  .get(checkPermission, controllers.readUsers)
  .post(checkPermission, controllers.createUser);

router
  .route("/:user_id")
  .get(controllers.readUser)
  .put(checkPermission, controllers.updateUser)
  .delete(checkPermission, controllers.deleteUser);

router
  .route("/:user_id/settings")
  .patch(recalcLogStatistics, controllers.updateSettings);

router.route("/:user_id/logs").post(updateLogStatistics, controllers.createLog);

router
  .route("/:user_id/logs/:log_id")
  .put(updateLogStatistics, controllers.updateLog)
  .delete(updateLogStatistics, controllers.deleteLog);

router
  .route("/:user_id/exercises")
  .post(handleFiles, controllers.createExercise);

router
  .route("/:user_id/exercises/:exercise_id")
  .put(handleFiles, controllers.updateExercise)
  .delete(controllers.deleteExercise);

router.route("/:user_id/workouts").post(controllers.createWorkout);

router
  .route("/:user_id/workouts/:workout_id")
  .put(controllers.updateWorkout)
  .delete(controllers.deleteWorkout);

export default router;
