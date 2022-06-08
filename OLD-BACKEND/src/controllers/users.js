import UserServices from "../services/users.js";
import config from "../config/main.js";

const services = UserServices();

export default function UserControllers() {
  return {
    async signIn(req, res, next) {
      try {
        const user = await services.signIn(req.body);
        return res
          .status(200)
          .cookie(
            config.auth.refreshTokenCookies.name,
            user.cookie.refreshToken,
            {
              ...config.auth.refreshTokenCookies.options,
              expires: user.cookie.refreshTokenExpMS,
            },
          )
          .json({ message: "User signed in", user: user.body });
      } catch (error) {
        error.responseMessage = "Sign in failed";
        next(error);
      }
    },

    async refreshToken(req, res, next) {
      try {
        const token = await services.refresh(req.cookies);
        return res
          .status(200)
          .json({ message: "Access token refreshed", user: token });
      } catch (error) {
        error.responseMessage = "Refresh failed";
        next(error);
      }
    },

    async signOut(req, res, next) {
      try {
        await services.signOut(req.user.sub);
        return res.status(200).json({ message: "User signed out" });
      } catch (error) {
        error.responseMessage = "Sign out failed";
        next(error);
      }
    },

    async createUser(req, res, next) {
      try {
        const user = await services.createUser(req.body);
        return res.status(201).json({
          message: "User saved",
          user,
        });
      } catch (error) {
        error.responseMessage = "User could not be created";
        next(error);
      }
    },

    async readUsers(req, res, next) {
      try {
        const users = await services.readUser();
        return res.status(200).json({ users });
      } catch (error) {
        error.responseMessage = "Users could not be read";
        next(error);
      }
    },

    async readUser(req, res, next) {
      try {
        const user = await services.readUser(req.params.user_id);
        return res.status(200).json({ user });
      } catch (error) {
        error.responseMessage = "User could not be read";
        next(error);
      }
    },

    async updateUser(req, res, next) {
      try {
        const user = await services.updateUser(req.params.user_id, req.body);
        return res.status(200).json({ message: "User updated", user });
      } catch (error) {
        error.responseMessage = "User could not be updated";
        next(error);
      }
    },

    async deleteUser(req, res, next) {
      try {
        await services.deleteUser(req.params.user_id);
        return res.status(204).json({ message: "User deleted" });
      } catch (error) {
        error.responseMessage = "Users could not be deleted";
        next(error);
      }
    },

    async updateSettings(req, res, next) {
      try {
        const settings = await services.updateSettings(
          req.params.user_id,
          req.body,
        );
        return res
          .status(200)
          .json({ message: "User settings updated", settings });
      } catch (error) {
        error.responseMessage = "Settings could not be updated";
        next(error);
      }
    },

    async createLog(req, res, next) {
      try {
        const log = await services.createSubresource(
          req.params.user_id,
          "logs",
          req.body,
        );
        return res.status(201).json({
          message: "Log saved!",
          id: log._id.toString(),
          statistics: res.locals.statistics,
        });
      } catch (error) {
        error.responseMessage = "Log could not be created";
        next(error);
      }
    },

    async createExercise(req, res, next) {
      try {
        const exercise = await services.createSubresource(
          req.params.user_id,
          "exercises",
          req.body,
          req.files,
        );
        return res.status(201).json({
          message: "Exercise saved!",
          id: exercise._id.toString(),
        });
      } catch (error) {
        error.responseMessage = "Exercise could not be created";
        next(error);
      }
    },

    async createWorkout(req, res, next) {
      try {
        const exercise = await services.createSubresource(
          req.params.user_id,
          "workouts",
          req.body,
        );
        return res.status(201).json({
          message: "Workout saved!",
          id: exercise._id.toString(),
        });
      } catch (error) {
        error.responseMessage = "Workout could not be created";
        next(error);
      }
    },

    async updateLog(req, res, next) {
      try {
        const log = await services.updateSubresource(
          req.params.user_id,
          "logs",
          req.params.log_id,
          req.body,
        );
        return res.status(200).json({
          message: "Log updated!",
          id: log._id,
          statistics: res.locals.statistics,
        });
      } catch (error) {
        error.responseMessage = "Log could not be updated";
        next(error);
      }
    },

    async updateExercise(req, res, next) {
      try {
        const exercise = await services.updateSubresource(
          req.params.user_id,
          "exercises",
          req.params.exercise_id,
          req.body,
          req.files,
        );
        return res.status(200).json({
          message: "Exercise updated!",
          id: exercise._id.toString(),
        });
      } catch (error) {
        error.responseMessage = "Exercise could not be updated";
        next(error);
      }
    },

    async updateWorkout(req, res, next) {
      try {
        const workout = await services.updateSubresource(
          req.params.user_id,
          "workouts",
          req.params.workout_id,
          req.body,
        );
        return res.status(200).json({
          message: "Workout updated",
          id: workout._id.toString(),
        });
      } catch (error) {
        error.responseMessage = "Workout could not be updated";
        next(error);
      }
    },

    async deleteLog(req, res, next) {
      try {
        await services.deleteSubresource(
          req.params.user_id,
          "logs",
          req.params.log_id,
        );
        return res.status(200).json({
          message: "Log deleted",
          id: req.params.log_id,
          statistics: res.locals.statistics,
        });
      } catch (error) {
        error.responseMessage = "Log could not be deleted!";
        next(error);
      }
    },

    async deleteExercise(req, res, next) {
      try {
        await services.deleteSubresource(
          req.params.user_id,
          "exercises",
          req.params.exercise_id,
        );
        return res.status(204).send();
      } catch (error) {
        error.responseMessage = "Exercise could not be deleted";
        next(error);
      }
    },

    async deleteWorkout(req, res, next) {
      try {
        await services.deleteSubresource(
          req.params.user_id,
          "workouts",
          req.params.workout_id,
        );
        return res.status(204).send();
      } catch (error) {
        error.responseMessage = "Workouts could not be deleted";
        next(error);
      }
    },
  };
}
