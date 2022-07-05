import { Routes } from "./Routes";

export class RouteModule {
    static routes : Routes;
    static forRoot(routes : Routes) : Routes {
        this.routes = routes;
        return this.routes;
    }
}