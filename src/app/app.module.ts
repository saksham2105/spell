import { RouteModule } from "../libs/RouteModule";
import { Routes } from "../libs/Routes";

import { SpellModuleDecorator } from "../libs/SpellModuleDecorator";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./register/register.component";

const routes : Routes = [
  {path : '/home',component : AppComponent},
  {path : '/register',component : RegisterComponent}
];

@SpellModuleDecorator({
    declarations : [
        AppComponent,
        RegisterComponent
    ],
    imports : [RouteModule.forRoot(routes)],
    providers : [],
    bootstrap : [AppComponent]
}
)
export class AppModule {
  constructor() {
    console.log("App module is being invoked");
  }
}