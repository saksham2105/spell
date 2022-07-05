export interface Route {
    path : string | null;
    redirectTo? : string | null;
    component? : any | null;
    pathMatch? : string | null;
    children? : Array<Route> | null;
}