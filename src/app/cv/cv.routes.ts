import { Route } from "@angular/router";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CvComponent } from "./cv/cv.component";
import { AddCvComponent } from "./add-cv/add-cv.component";
import { DetailsCvComponent } from "./details-cv/details-cv.component";
import { MasterDetailsCvComponent } from "./master-details-cv/master-details-cv.component";

const CV_ROUTES: Route[] = [
  { path: "", component: CvComponent },
  { path: "add", component: AddCvComponent, canActivate: [AuthGuard] },
  {
    path: "list",
    component: MasterDetailsCvComponent,
    children: [{ path: ":id", component: DetailsCvComponent }],
  },
  { path: ":id", component: DetailsCvComponent },
];

export default CV_ROUTES;