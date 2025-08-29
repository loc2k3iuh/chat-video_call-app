import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    //  setup axios interceptor
    const interceptor = axiosInstance.interceptors.request.use(
      async (congfig) => {
        try {
          const token = await getToken();
          if (token) {
            congfig.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          if (
            error.message?.includes("auth") ||
            error.message?.includes("token")
          ) {
            toast.error("Authentication issue. Please refesh the page");
          }
          console.log("Error getting token: ", error);
        }
        return congfig;
      },
      (error) => {
        console.log("Axios request error: ", error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
