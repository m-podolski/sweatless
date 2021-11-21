import {
  dateTime,
  months,
  hoursFloatToTime,
  onlyFloatToDec2,
  parseFloatNaNSafe,
} from "../util/dateAndTime.js";

export function Totals(totals, fieldsConfig) {
  let dataset;

  if (totals?.length) {
    dataset = totals;
  } else {
    let crossTotalFields = [];
    const totals = fieldsConfig.reduce((totals, field) => {
      if (["Date", "Notes"].includes(field.label)) return totals;
      let totalField = {
        label: field.label,
        unit: field.unit || null,
        total: 0,
      };
      if (field?.options?.length) {
        field.options.forEach((option) => {
          if (option?.fields?.length) {
            const optionFields = option.fields.reduce(
              (optionFields, optionField) => {
                if (optionField.type === "number") {
                  crossTotalFields.push(optionField.label);
                  optionFields.push({
                    label: optionField.label,
                    unit: optionField.unit || null,
                    total: 0,
                  });
                }
                return optionFields;
              },
              [],
            );
            totals.push({
              label: option.label,
              total: 0,
              fields: [...optionFields],
            });
          }
        });
      } else {
        totals.push(totalField);
      }
      return totals;
    }, []);

    crossTotalFields = [
      ...new Set(
        crossTotalFields.filter((field, i, array) => {
          return array.indexOf(field) !== array.lastIndexOf(field);
        }),
      ),
    ];

    const crossTotals = totals.reduce((crossTotals, field) => {
      if (field.fields) {
        field.fields.forEach((subField) => {
          if (crossTotalFields.includes(subField.label)) {
            crossTotals.push({
              label: subField.label,
              unit: subField.unit,
              total: 0,
            });
            crossTotalFields.splice(
              crossTotalFields.indexOf(subField.label),
              1,
            );
          }
        });
      }
      return crossTotals;
    }, []);

    dataset = [
      { label: "Logs", unit: null, total: 0 },
      ...totals,
      ...crossTotals,
    ];
  }

  return {
    get dataset() {
      return dataset;
    },
    set dataset(value) {
      dataset = value;
    },
    add(log) {
      this.calc("ADD", log);
    },
    subtract(log) {
      this.calc("SUB", log);
    },
    calc(mode, log) {
      this.dataset[0].total += mode === "ADD" ? 1 : -1;
      this.dataset[1].total += mode === "ADD" ? log.Duration : -log.Duration;

      const totalField = this.dataset.find(
        (field) => field.label === log.Training,
      );
      if (totalField) {
        totalField.total += mode === "ADD" ? 1 : -1;
        // TODO remove ?
        // const logResults = JSON.parse(log.Results);
        const logResults = log.Results;

        Object.keys(logResults).forEach((field) => {
          const totalSubField = totalField.fields.find(
            (totalSubField) => totalSubField.label === field,
          );
          if (totalSubField) {
            totalSubField.total +=
              mode === "ADD"
                ? Number(logResults[field].value)
                : -Number(logResults[field].value);
          }

          const crossTotalField = this.dataset.find(
            (totalField) => totalField.label === field,
          );
          if (crossTotalField) {
            crossTotalField.total +=
              mode === "ADD"
                ? Number(logResults[field].value)
                : -Number(logResults[field].value);
          }
        });
      }
    },
    format(formatFloat = onlyFloatToDec2, formatHours = hoursFloatToTime) {
      return this.dataset.map((field) => {
        let formattedField;
        if (field.unit === "hours") {
          formattedField = { ...field, total: formatHours(field.total) };
        } else {
          formattedField = { ...field };
        }
        if (field.fields) {
          formattedField.fields = field.fields.map((subField) => {
            return { ...subField, total: formatFloat(subField.total) };
          });
        }
        return formattedField;
      });
    },
  };
}

export function Proportions(proportions, fieldsConfig) {
  let dataset = [];

  if (proportions?.length) {
    dataset = proportions;
  } else {
    dataset = fieldsConfig.reduce((proportions, field) => {
      proportions.push({
        label: field.label,
        count: 0,
        percent: 0,
        cumulated: 0,
      });
      return proportions;
    }, []);
  }

  return {
    get dataset() {
      return dataset;
    },
    set dataset(value) {
      dataset = value;
    },
    add(currentLogsCount, trainingType) {
      this.calc("ADD", currentLogsCount, trainingType);
    },
    subtract(currentLogsCount, trainingType) {
      this.calc("SUB", currentLogsCount, trainingType);
    },
    calc(mode, currentLogsCount, trainingType) {
      const training = this.dataset.find(
        (field) => field.label === trainingType,
      );
      const logsCount =
        mode === "ADD" ? currentLogsCount + 1 : currentLogsCount - 1;
      training.count += mode === "ADD" ? 1 : -1;
      this.dataset.forEach((field) => {
        field.percent = Math.round((field.count / logsCount) * 100);
      });
    },
    cumulate() {
      this.dataset.forEach((field, i, array) => {
        field.cumulated = i === 0 ? 0 : field.percent + array[i - 1].cumulated;
      });
    },
  };
}

export function Timeline(timeline, scale) {
  let dataset = [];
  const initField = { name: null, date: null };

  if (timeline?.length) {
    dataset = timeline;
  } else {
    for (let i = 0; i < scale; i++) {
      dataset[i] = initField;
    }
  }

  return {
    get dataset() {
      return dataset;
    },
    set dataset(value) {
      dataset = value;
    },
    add(log) {
      this.calc("ADD", log);
    },
    subtract(log) {
      this.calc("SUB", log);
    },
    calc(mode, log) {
      const logDate = new Date(log.Date);
      const diff = new Date().getTime() - logDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const index = dataset.length - 1 - days;

      if (days < scale) {
        if (mode === "ADD") {
          dataset[index] = {
            ...initField,
            name: log.Training,
            date: dateTime("date", false, logDate),
          };
        } else {
          dataset[index] = initField;
        }
      }
    },
  };
}

export function Graph(graph, fieldsConfig, plottedField) {
  let dataset = { data: [], keys: [], unit: null };
  let firstOfCurrentMonth;

  if (graph?.data?.length) {
    dataset = graph;
  } else {
    // labels match the 'dataset.fields' list by index
    // datasetKeys are only valid if the fields marked with 'plotGraph: true' in settings are of the same name/type
    const datasetKeys = fieldsConfig.reduce((datasetKeys, option) => {
      if (option?.fields?.length) {
        option.fields.forEach((field, i) => {
          if (field.label === plottedField) {
            datasetKeys.push(option.label);
          }
          if (i === 0) dataset.unit = field.unit;
        });
      }
      return datasetKeys;
    }, []);
    dataset.keys = datasetKeys;

    const endDate = new Date();
    let monthsScale = months
      .slice(endDate.getMonth() + 1)
      .concat(months.slice(0, endDate.getMonth() + 1));
    firstOfCurrentMonth = new Date(endDate.getFullYear(), endDate.getMonth());

    for (let i = 0; i < 12; i++) {
      dataset.data[i] = {
        name: monthsScale[i][1],
        total: 0,
        fields: [],
      };
      dataset.keys.forEach((key, j) => {
        dataset.data[i].fields[j] = 0;
      });
    }
  }

  return {
    get dataset() {
      return dataset;
    },
    set dataset(value) {
      dataset = value;
    },
    add(log) {
      this.calc("ADD", log);
    },
    subtract(log) {
      this.calc("SUB", log);
    },
    calc(mode, log) {
      const logDate = new Date(log.Date);
      const logResults = JSON.parse(log.Results);
      const logPlottedFieldKey = Object.keys(logResults).find(
        (key) => key === plottedField,
      );
      const logPlottedField = logResults[logPlottedFieldKey];

      if (logPlottedFieldKey) {
        const valueKey = dataset.keys.findIndex((key) => key === log.Training);
        const monthsAgo =
          Math.floor(
            (firstOfCurrentMonth.getTime() - logDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30),
          ) + 1;
        const monthIndex = 12 - 1 - monthsAgo;

        let currentDataField = dataset.data[monthIndex].fields[valueKey];
        let currentDataTotal = dataset.data[monthIndex].total;
        const parsedValue =
          mode === "ADD"
            ? parseFloatNaNSafe(logPlottedField.value)
            : -parseFloatNaNSafe(logPlottedField.value);

        dataset.data[monthIndex].fields[valueKey] =
          currentDataField === null
            ? parsedValue
            : currentDataField + parsedValue;

        dataset.data[monthIndex].total =
          currentDataTotal === null
            ? parsedValue
            : currentDataTotal + parsedValue;
      }
    },
  };
}
