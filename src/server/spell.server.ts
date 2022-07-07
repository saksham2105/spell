import express,{Application,Request,Response,NextFunction} from "express";

import {SpellServerUtil} from "./spell.server.util";

import config from "../../package.conf.json";
import { Component } from "../libs/Component";

var components : Component[] = new Array<Component>();

const getNewServerUtilInstance = () => new SpellServerUtil();

const spellServerUtil : SpellServerUtil = getNewServerUtilInstance(); 

const spellServer : Application = express();

spellServer.use(express.static(process.cwd()+"/src/"+spellServerUtil.getResourcesDir()));

export function addComponent(component : Component) {
 components.push(component);
};

spellServer.get('/',(request : Request ,response : Response,
    next : NextFunction) => {
     spellServerUtil.serveStaticContent(process.cwd()+"/src/resources/spell.html",response,config,new Component(),'/',true);    
});

const buildMapAndServeContent = (component : Component,response : Response,uri : string,generateScript : boolean) => {
  let map : any = {}; 
  let instance : any = component.getInstance();
  //Populating Map
  for (let i=0;i<component.keys.length;i++) {
      map[component.keys[i]] = instance[component.keys[i]];
  }
  if (component.getTemplateUrl() != null 
  && component.getTemplateUrl() != undefined 
  && component.getTemplateUrl().length > 0) {
    spellServerUtil.serveStaticContent(component.getPath()+"\\"+component.getTemplateUrl(),response,map,component,uri,generateScript);
  } else if(component.getTemplate() != null 
  && component.getTemplate() != undefined 
  && component.getTemplate().length > 0) {
    spellServerUtil.serveStaticContextFromText(component.getTemplate(),response,map,component,uri,generateScript);
  }
};

//Api to Get invokable function and selector from Frontend
spellServer.get("/spell/api",(request :Request,response : Response,next : NextFunction) => {
   let invokableFunction : any = request.query["invokableFunction"];
   let selector : any = request.query["selector"];
   let uri : any = request.query["uri"];
   let component : Component = new Component();
   for (let i=0;i<components.length;i++) {
    if (components[i].getSelector() == selector) {
       component = components[i];
       break;  
    }
   }
   let functionName = spellServerUtil.extractFunctionNameFromFunctionString(invokableFunction);
   if (functionName.length == 0) {
    response.send("Invalid function");
    return;
   }
   let parameters : any[] = spellServerUtil.extractParametersFromFunctionString(invokableFunction);
   for (let i=0;i<parameters.length;i++) {
     parameters[i] = parameters[i].replace(/["']/g, "");
   }
   component.invokeFunction(functionName,parameters);
   buildMapAndServeContent(component,response,uri,false);
});
spellServerUtil.scanModulesAndBuildComponents(components,spellServer);

export const mapUriWithComponents = (uri : string,component : Component,
    comps : Component[]) => {
    spellServer.get(uri,(request : Request,
        response : Response,next : NextFunction) => {
              spellServerUtil.scanModulesAndBuildComponents(comps,spellServer);
              buildMapAndServeContent(component,response,uri,true);
    });
   }

spellServer.listen(spellServerUtil.getPort(), () => {
    console.log(`Server is running on port ${spellServerUtil.getPort()}`);
});
