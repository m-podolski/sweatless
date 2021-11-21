import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function useFetch(
  errorMessage = {
    message: "Connection Error",
    errors: "Data could not be fetched",
  },
) {
  const navigate = useNavigate();
  const { auth, userUrl, signOut } = useAuth();
  const [fetchError, setFetchError] = useState(false);

  async function doFetch(httpMethod = "GET", path = "", requestData = null) {
    let fetchInit = {};
    switch (httpMethod) {
      case "POST":
      case "PUT":
      case "PATCH":
        fetchInit = {
          method: httpMethod,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(requestData),
        };
        break;
      case "DELETE":
      default:
        fetchInit = {
          method: httpMethod,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        };
        break;
    }

    if (auth.token) {
      setFetchError(false);
      try {
        const response = await fetch(`${userUrl}/${path}`, fetchInit);
        if (response.status === 401) {
          signOut();
          navigate("/signin");
          return;
        }
        const responseData = await response.json();
        if (responseData.errors) {
          setFetchError(responseData);
        } else {
          return responseData;
        }
      } catch (error) {
        setFetchError(errorMessage);
      }
    } else {
      navigate("/signin");
    }
  }

  return [doFetch, fetchError];
}

export { useFetch };
