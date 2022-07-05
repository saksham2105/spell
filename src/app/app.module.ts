import { SpellModuleDecorator } from "../libs/SpellModuleDecorator";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./register/register.component";

@SpellModuleDecorator({
    declarations : [
        AppComponent,
        RegisterComponent
    ],
    imports : [],
    providers : [],
    bootstrap : [AppComponent]
}
)
export class AppModule {
  constructor() {
  }
}