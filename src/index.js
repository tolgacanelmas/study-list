import { Router } from "@vaadin/router";
import "./app-layout";
import "./pages/employee-list";
import "./pages/employee-create";
import "./index.css";
import { setLocale } from "./localization";

setLocale(localStorage.getItem("locale") || "en");

const outlet = document.getElementById("outlet");
const router = new Router(outlet);

router.setRoutes([
  {
    path: "/",
    component: "app-layout",
    children: [
      { path: "/", component: "employee-list" },
      { path: "/create", component: "employee-create" },
    ],
  },
]);
