export class Component {
    selector : string = "";
    interpolationMap : Map<string,string> = new Map();
    templateUrl : string = "";
    styleUrls : string[] = new Array<string>();
    instance : any = null;
    keys : any = null;
    constructor() {

    }
    setSelector(selector : string) {
        this.selector = selector;
    }
    getSelector() : string {
        return this.selector;
    }
    setInterpolationMap(interpolationMap : Map<string,string>) {
        this.interpolationMap = interpolationMap;
    }
    getInterpolationMap() : Map<string,string> {
        return this.interpolationMap;
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