export class Component {
    selector : string = "";
    templateUrl : string = "";
    template : string = ""; 
    styleUrls : string[] = new Array<string>();
    instance : any = null;
    keys : any = null;
    path : string = "";
    uri : string = "";
    constructor() {

    }
    setPath(path : string) {this.path = path;}
    getPath() : string {return this.path;}
    setUri(uri : any) {this.uri=uri;}
    getUri() : any {return this.uri;}
    setSelector(selector : string) {
        this.selector = selector;
    }
    getSelector() : string {
        return this.selector;
    }
    setTemplate(template : string) : void {
        this.template = template;
    }
    getTemplate() : string {
        return this.template;
    }
    setTemplateUrl(templateUrl : string) {
       this.templateUrl = templateUrl;
    }
    getTemplateUrl() : string {return this.templateUrl;}
    setStyleUrls(styleUrls : string[]) {this.styleUrls = styleUrls;}
    getStyleUrls() : string[] {
        return this.styleUrls;
    }
    setInstance(instance : any) {
      this.instance = instance;
    } 
    getInstance() : any {return this.instance;}
    setKeys(keys : any) {this.keys = keys;}
    getKeys() : any{return this.keys;}
    invokeFunction(name : string,params : Array<any>) : boolean {
        try{
            this.instance[name](params);
            return true;
        }catch(e) {
           console.log("Exception occured while invoking method "+name+" as "+e);
           return false;
        }
    }
  }