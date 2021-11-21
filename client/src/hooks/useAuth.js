import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";

const AuthContext = createContext();

const authInit = {
  id: null,
  token: null,
  expires: null,
};

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(authInit);
  const userUrl = `${config.api.base}/${auth.id}`;
  const [fetchAuthError, setFetchAuthError] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const doFetchAuth = useCallback(
    async (
      httpMethod = "GET",
      path = "",
      requestData = null,
      currentAuth = null,
    ) => {
      let fetchInit = {};
      switch (httpMethod) {
        case "POST":
          fetchInit = {
            method: httpMethod,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestData),
          };
          break;
        case "DELETE":
          fetchInit = {
            method: httpMethod,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${currentAuth.token}`,
            },
          };
          break;
        default:
          fetchInit = {
            method: httpMethod,
            headers: {
              Accept: "application/json",
            },
          };
          break;
      }
      setFetchAuthError(false);
      try {
        const response = await fetch(`${config.api.base}/${path}`, fetchInit);
        const data = await response.json();
        if (data.errors) {
          if (path !== "refresh") {
            setFetchAuthError(data);
          }
          return false;
        } else {
          if (path === "signout") {
            setAuth(authInit);
          } else {
            setAuth(data.user);
          }
          navigate(state?.path || "/");
          if (path === "refresh") {
            return true;
          }
        }
      } catch (error) {
        setFetchAuthError({
          message: "Authentication Error",
          errors: `Access token could not be ${
            path === "refresh" ? "refreshed" : "fetched"
          }`,
        });
        return false;
      }
    },
    [navigate, state],
  );

  async function signOut() {
    await doFetchAuth("DELETE", "signout", null, auth);
    localStorage.setItem("sweatless-logout", Date.now());
  }

  useEffect(() => {
    if (auth.expires) {
      const id = setTimeout(() => {
        doFetchAuth("GET", "refresh");
      }, (auth.expires - config.auth.refreshHeadStart) * 1000 - Date.now());
      return () => clearTimeout(id);
    } else {
      (async () => {
        const success = await doFetchAuth("GET", "refresh");
        if (success === false) {
          navigate("/signin");
        }
      })();
    }
  }, [auth, doFetchAuth, navigate]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        userUrl,
        doFetchAuth,
        fetchAuthError,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
