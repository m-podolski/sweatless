import config from "../config/main.js";
import { User } from "../models/User.js";
import {
  Totals,
  Proportions,
  Timeline,
  Graph,
} from "../services/logStatistics.js";

export async function updateLogStatistics(req, res, next) {
  try {
    const user = await User.findById(
      req.params.user_id,
      "settings logs statistics",
    );
    const trainingOptions = user.settings.logs.fields[2].options;
    const graphField = user.settings.stats.diagrams.graph.plottedField;

    const totals = Totals(
      user.statistics?.totals?.length ? user.statistics.totals : null,
      user.settings.logs.fields,
    );
    const proportions = Proportions(
      user.statistics?.proportions?.length ? user.statistics.proportions : null,
      trainingOptions,
    );
    const timeline = Timeline(
      user.statistics?.timeline?.length ? user.statistics.timeline : null,
      trainingOptions,
    );
    const graph = Graph(
      user.statistics?.graph?.data?.length ? user.statistics.graph : null,
      trainingOptions,
      graphField,
    );

    let prevLog = user.logs.id(req.params.log_id);
    const logsCount = user.logs.length;

    switch (req.method) {
      case "DELETE":
        totals.subtract(prevLog);
        proportions.subtract(logsCount, prevLog.Training);
        timeline.subtract(prevLog);
        graph.subtract(prevLog);
        break;
      case "PUT":
        totals.subtract(prevLog);
        proportions.subtract(logsCount, prevLog.Training);
        timeline.subtract(prevLog);
        graph.subtract(prevLog);
      // fall through
      case "POST":
        totals.add(req.body);
        proportions.add(logsCount, req.body.Training);
        timeline.add(req.body);
        graph.add(req.body);
        break;
      default:
        next(
          new Error(
            "'updateLogStatistics' must be called with 'req.method' = 'POST', 'PUT' or 'DELETE'",
          ),
        );
    }
    proportions.cumulate();

    user.statistics.totals = totals.dataset;
    user.statistics.proportions = proportions.dataset;
    user.statistics.timeline = timeline.dataset;
    user.statistics.graph = graph.dataset;
    user.save();

    // this sets the calculation objects to POJOs (instead of mongoose documents)
    const userPlain = user.toObject();
    totals.dataset = userPlain.statistics.totals;
    proportions.dataset = userPlain.statistics.proportions;
    timeline.dataset = userPlain.statistics.timeline;
    graph.dataset = userPlain.statistics.graph;

    res.locals.statistics = {
      totals: totals.format(),
      proportions: proportions.dataset,
      timeline: timeline.dataset,
      graph: graph.dataset,
    };
    next();
  } catch (error) {
    error.responseMessage = "Log statistics could not be updated";
    next(error);
  }
}

export async function recalcLogStatistics(req, res, next) {
  if (JSON.parse(req.query.recalcStatistics)) {
    try {
      const user = await User.findById(
        req.params.user_id,
        "settings logs statistics",
      );
      const trainingOptions = req.body.logs.fields[2].options;
      const graphField = user.settings.stats.diagrams.graph.plottedField;

      let totals = Totals(null, req.body.logs.fields);
      let proportions = Proportions(null, trainingOptions);
      let timeline = Timeline(null, config.app.logs.timelineScaleDays);
      let graph = Graph(null, trainingOptions, graphField);

      for (const log of user.logs) {
        totals.add(log);
        proportions.add(user.logs.length, log.Training);
        timeline.add(log);
        graph.add(log);
      }
      proportions.cumulate();

      user.statistics.totals = totals.dataset;
      user.statistics.proportions = proportions.dataset;
      user.statistics.timeline = timeline.dataset;
      user.statistics.graph = graph.dataset;
      user.save();

      res.locals.statistics = {
        totals: totals.format(),
        proportions: proportions.dataset,
        timeline: timeline.dataset,
        graph: graph.dataset,
      };
      next();
    } catch (error) {
      error.responseMessage = "Log statistics could not be recalculated";
      next(error);
    }
  }
}
