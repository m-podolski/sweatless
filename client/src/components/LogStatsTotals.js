import React from "react";

function LogStatsTotals({ totals, heading }) {
  return (
    <section className="totals">
      <h3 className="ui-heading">{heading}</h3>
      <dl>
        {Object.keys(totals).map((field) => {
          if (typeof totals[field] !== "function") {
            return (
              <React.Fragment key={field}>
                <dt>{totals[field].label}</dt>
                <dd className={totals[field].fields ? "" : "num"}>
                  {totals[field].fields
                    ? Object.keys(totals[field].fields).map((key) => {
                        return (
                          <dl key={key}>
                            <dt>{totals[field].fields[key].label}</dt>
                            <dd className="num">
                              {`${totals[field].fields[key].result} ${
                                totals[field].fields[key].unit
                                  ? totals[field].fields[key].unit
                                  : ""
                              }`}
                            </dd>
                          </dl>
                        );
                      })
                    : `${totals[field].result} ${
                        totals[field].unit ? totals[field].unit : ""
                      }`}
                </dd>
              </React.Fragment>
            );
          } else {
            return null;
          }
        })}
      </dl>
    </section>
  );
}

export default LogStatsTotals;
