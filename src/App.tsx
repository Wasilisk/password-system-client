import { Navigate, Route, Routes } from "react-router";
import { Profile } from "./pages/Profile";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Background } from "./components/Background";
import backgroundImage from "./assets/images/auth-background.gif";
import { useAuth } from "./utils/contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const { isAuth } = useAuth();
  console.log("isAuth", isAuth);
  return (
    <>
      <Background url={backgroundImage} />
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route index path="login" element={<Login />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute redirectPath="/login" isAllowed={isAuth}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/profile" : "/login"} replace />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
