import {
  useAuth
} from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import { Navigate, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);
export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  if(!isLoaded) return null;
  return (
    <>
      <SentryRoutes>
        <Route
          path="/"
          element={
            isSignedIn ? <HomePage /> : <Navigate to={"/auth"} replace />
          }
        />
        <Route
          path="/auth"
          element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
        />

         <Route
          path="/call/:id"
          element={isSignedIn ? <CallPage /> : <Navigate to={"/auth"} replace />}
        />
        {/* Todo: add call page */}
        <Route
          path="*"
          element={
            isSignedIn ? (
              <Navigate to={"/"} replace />
            ) : (
              <Navigate to={"/auth"} replace />
            )
          }
        />
      </SentryRoutes>
    </>
  );
}

// First version of code
{
  /* <SignedIn>
        <SentryRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to={"/"} replace />} />
        </SentryRoutes>
      </SignedIn>
      <SignedOut>
        <SentryRoutes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={"/auth"} replace />} />
        </SentryRoutes>
      </SignedOut> */
}
