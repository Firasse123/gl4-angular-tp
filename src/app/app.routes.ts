import { Route } from "@angular/router";
import { FrontComponent } from "./templates/front/front.component";

export const routes: Route[] = [
  {
    path: "login",
    loadComponent: () =>
      import("./auth/login/login.component").then((m) => m.LoginComponent),
    data: { preload: true },
  },
  {
    path: "rh",
    loadComponent: () =>
      import("./optimizationPattern/rh/rh.component").then((m) => m.RhComponent),
  },
  {
    path: "cv",
    loadChildren: () => import("./cv/cv.routes"),
    data: { preload: true },
  },
  {
    path: "",
    component: FrontComponent,
    children: [
      {
        path: "todo",
        loadComponent: () =>
          import("./todo/todo/todo.component").then((m) => m.TodoComponent),
      },
      {
        path: "word",
        loadComponent: () =>
          import("./directives/mini-word/mini-word.component").then((m) => m.MiniWordComponent),
      },
      {
        path: "rainbow",
        loadComponent: () =>
          import("./directives/rainbow-test/rainbow-test.component").then((m) => m.RainbowTestComponent),
      },
      {
        path: "ttc",
        loadComponent: () =>
          import("./components/ttc/ttc.component").then((m) => m.TtcComponent),
      },
      {
        path: "currency",
        loadComponent: () =>
          import("./tp2/currency-selector/country-currency-selector.component").then(
            (m) => m.CountryCurrencySelectorComponent
          ),
      },
      {
        path: "products-filter",
        loadComponent: () =>
          import("./tp2/products-filter/products-filter.component").then(
            (m) => m.ProductsFilterComponent
          ),
      },
    ],
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./templates/admin/admin.component").then((m) => m.AdminComponent),
    children: [
      {
        path: "color",
        loadComponent: () =>
          import("./components/color/color.component").then((m) => m.ColorComponent),
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./components/nf404/nf404.component").then((m) => m.NF404Component),
  },
];