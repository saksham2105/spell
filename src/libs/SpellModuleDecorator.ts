import { SpellModule } from "./SpellModule";

import {setModule} from "../server/spell.server.util";

export function SpellModuleDecorator(obj : any) {
   return function(target : any) {
      var module : SpellModule = new SpellModule();
      let declarations : any[] = obj["declarations"];
      let imports : any[] = obj["imports"];
      let providers : any[] = obj["providers"];
      let bootstrap : any[] = obj["bootstrap"];
      module.setDeclarations(declarations);
      module.setImports(imports);
      module.setProviders(providers);
      module.setBootstrap(bootstrap);
      setModule(module);
   }
}
