import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath: string;
  children: JSX.Element;
}

export const ProtectedRoute = ({
  isAllowed,
  redirectPath,
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
