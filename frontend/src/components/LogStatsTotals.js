import { Fragment } from "react";

export default function LogStatsTotals({ dataset, heading }) {
  if (dataset?.length) {
    return (
      <section className="totals">
        <h3 className="ui-heading">{heading}</h3>
        <dl>
          {dataset.map((field) => (
            <Fragment key={field.label}>
              <dt>{field.label}</dt>
              <dd className={field.fields ? "" : "num"}>
                <dl>
                  <dt>Total</dt>
                  <dd className="num">{`${field.total} ${
                    field.unit ? field.unit : ""
                  }`}</dd>
                  {field.fields
                    ? field.fields.map((subField) => (
                        <Fragment key={subField.label}>
                          <dt>{subField.label}</dt>
                          <dd className="num">
                            {`${subField.total} ${
                              subField.unit ? subField.unit : ""
                            }`}
                          </dd>
                        </Fragment>
                      ))
                    : null}
                </dl>
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>
    );
  } else {
    return null;
  }
}
