import { RouterProvider } from "react-router-dom";
import { routes } from "../../routes/routes";

const RouteProvider  = () => {
  return <RouterProvider router={routes} />;
};

export default RouteProvider;
