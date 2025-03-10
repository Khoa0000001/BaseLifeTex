import MainLayout from "../layouts/mainLayout/MainLayout";
import LoginLayout from "../layouts/loginLayout/LoginLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import TaskTable from "../pages/ListHome/ListHome";
const publicRoutes = [
  {
    path: "/",
    component: Home,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: LoginLayout,
  },
  {
    path: "/register",
    component: Register,
    layout: LoginLayout,
  },
  {
    path: "/ListHome",
    component: TaskTable,
    layout: MainLayout,
  },
];

export { publicRoutes };
