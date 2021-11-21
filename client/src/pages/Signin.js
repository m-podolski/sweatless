import { Fragment, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import Errors from "../components/Errors";

export default function Signin() {
  const { doFetchAuth, fetchAuthError } = useAuth();
  const [input, setInput] = useState({ email: "", password: "" });

  function handleInput({ target: { id, value } }) {
    setInput({ ...input, [id]: value });
  }

  return (
    <Fragment>
      <Header />
      <main aria-live="polite" id="main">
        <section className="form-container">
          <h1 className="sr-only">Sign In</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doFetchAuth("POST", "signin", input);
            }}
            noValidate
          >
            <Errors error={fetchAuthError} />
            <label className="field-large">
              <span>Email</span>
              <input
                type="email"
                id="email"
                value={input.email}
                onChange={handleInput}
                className={true ? "" : "error"}
                aria-invalid={true === false}
                aria-errormessage="email"
              />
            </label>
            <label className="field-large">
              <span>Password</span>
              <input
                type="password"
                id="password"
                value={input.password}
                onChange={handleInput}
                className={true ? "" : "error"}
                aria-invalid={true === false}
                aria-errormessage="password"
              />
            </label>
            <div className="button-container">
              <button
                type="submit"
                className="button-primary button-row button-input"
              >
                Sign In
              </button>
            </div>
          </form>
        </section>
      </main>
    </Fragment>
  );
}
