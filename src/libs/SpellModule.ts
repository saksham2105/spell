export class SpellModule {
    declarations : any[] = new Array<any>();
    imports : any[] = new Array<any>();
    providers: any[] = new Array<any>();
    bootstrap : any[] = new Array<any>();
    constructor() {
       
    }
    setDeclarations(declarations : any[]) : void {this.declarations = declarations;}
    getDeclarations() : any[] {return this.declarations;}
    setImports(imports : any[]) : void {this.imports = imports;}
    getImports() : any[] {return this.imports;}
    setProviders(providers : any[]) : void {this.providers = providers;}
    getProviders() : any[] {return this.providers;}
    setBootstrap(bootstrap : any[]) : void {this.bootstrap = bootstrap;}
    getBootstrap() : any[] {return this.bootstrap;}
}