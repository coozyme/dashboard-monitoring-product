import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {
   const { children } = props;

   const menuAccessUser = localStorage?.getItem("accessToken");

   return menuAccessUser ? (
      children
   ) : (
      <Navigate to="/auth-login" />
   );
};

export default PrivateRoute;