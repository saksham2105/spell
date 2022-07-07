import {Application,  NextFunction,  Response} from "express";

import fs, { read } from 'fs';

import path from "path";

import { mapUriWithComponents } from "./spell.server";
import conf from "../../package.conf.json";
import { Component } from "../libs/Component";
import { SpellModule } from "../libs/SpellModule";
import { Routes } from "../libs/Routes";
import { parse } from 'node-html-parser';


var module : SpellModule = new SpellModule();

export function setModule(mod : SpellModule) {
  module = mod;
};

//TODO:
/**
 * To Add Code to Parse Html using some library
 * Parse interpolation
 * Manipulate Html script for component
 * Handle event listener by sending request from frontend to backend
 * Create Different Directive and handle Requests by Calling Rest Api of Spell Server 
 */
export function getModule() : SpellModule {
   return module;
};
export class SpellServerUtil {
      
     clickAttribute = "(click)";
     spellModelAttribute = "[spellModel]";
     changeAttribute = "(change)";
     interpolationSuffix : string = "}";
     interpolationPrefix : string = "{";
     constructor() {
     }

     createScriptElement(document : any,generateScript: boolean) : void {
       if (generateScript) {
        let html = document.innerHTML;
        document.innerHTML += "<script></script>"+html;
      }
     }

     getParameterKey(attribute : string) : string {
           if(attribute == this.clickAttribute || attribute == this.changeAttribute) {
            return "invokableFunction";
           }
           if (attribute == this.spellModelAttribute) {
             return "key";
           }
           return "";
     }

     //binding onload listener
     bindWindowOnLoadListener(document : any,
      scriptElement : any,
      component : Component,uri : string,
      generateScript : boolean,
      resetListenerFunction : string,
      listenerEvent : string,
      event : string,
      attribute : string) : void {
       if (generateScript) {
        scriptElement.innerHTML = "";
        let elements = document.getElementsByTagName("*");
        scriptElement.innerHTML += `function ${resetListenerFunction}(){`;
        scriptElement.innerHTML += `let elements = document.getElementsByTagName("*");`;
        for (let i=2;i<elements.length;i++) {
         let value = ""
         if (elements[i].hasAttribute(attribute)) {
           value = elements[i].getAttribute(attribute);
         }
         let key = this.getParameterKey(attribute);
         scriptElement.innerHTML += `
           if (elements[${i+2}].hasAttribute("${attribute}")) {
            elements[${i+2}].${listenerEvent}("${event}",(e) => {
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function() {
                  if (xhr.readyState == XMLHttpRequest.DONE) {
                      document.getElementsByTagName("body")[0].innerHTML = "";
                      document.getElementsByTagName("body")[0].innerHTML = xhr.responseText;
                      resetAddEventListener();
                  }
              }
              xhr.open("GET", "${conf.protocol}://${conf.host}:${conf.port}/spell/api?${key}=${value}&selector=${component.getSelector()}&uri=${uri}", true);
              xhr.send(null);
           });
          }`; 
        } 
        scriptElement.innerHTML += `}`; 
        scriptElement.innerHTML += `window.onload=function() {`;
        scriptElement.innerHTML += `${resetListenerFunction}();`
        scriptElement.innerHTML += `};`
        }
     }

     createBody() : string {
       return "<body></body>";
     }
     //Binding Click events to elements
     bindClickEventListeners(document : any,component : Component,uri : string,generateScript : boolean) : any {
           let scriptElement = null;
           let elements = document.getElementsByTagName("*");
           for (let i=0;i<elements.length;i++) {
             if (elements[i].tagName == "SCRIPT") {
                scriptElement = elements[i];
                break;               
             }
           }
           if (scriptElement != null) this.bindWindowOnLoadListener(document,scriptElement,component,uri,generateScript,"resetAddEventListener","addEventListener","click",this.clickAttribute);
           return document;
     }

     //Serve Static content from File
     serveStaticContent(file : any,response : Response,
      config : any,
      component : Component,uri : string,generateScript : boolean) : void {
          fs.readFile(file,'utf8',(err , data  : string) => {
            var document : any = parse(data);
            let html = this.processInterpolation(document.innerHTML,config);
            document.innerHTML = "";
            this.createScriptElement(document,generateScript);
            let html1 = html;
            document.innerHTML += this.createBody();
            document.getElementsByTagName("body")[0].innerHTML += html1;
            document = this.bindClickEventListeners(document,component,uri,generateScript);
            if(generateScript) response.send(document.innerHTML);
            else response.send(document.getElementsByTagName("body")[0].innerHTML);
              if (err) {
               throw err;
              }
          });  
     }

     //Server Static Context via template text
     serveStaticContextFromText(html : string,
      response : Response,
      config : any,
      component : Component,
      uri : string,
      generateScript : boolean) : void {
      var document : any = parse(html);
      let htmlString = this.processInterpolation(document.innerHTML,config);
      document.innerHTML = "";
      this.createScriptElement(document,generateScript);
      let html1 = htmlString;
      document.innerHTML += this.createBody();
      document.getElementsByTagName("body")[0].innerHTML += html1;      
      document = this.bindClickEventListeners(document,component,uri,generateScript);
      if(generateScript) response.send(document.innerHTML);
      else response.send(document.getElementsByTagName("body")[0].innerHTML);
    }

     getPort() : number {
        return conf.port;
     }

     getResourcesDir() : String {
       return conf.resources;
     }

     isNumber(str: string): boolean {
      if (typeof str !== 'string') {
        return false;
      }
      if (str.trim() === '') {
        return false;
      }
      return !Number.isNaN(Number(str));
    }

    isBoolean(value : any) : boolean{ 
      switch(value) { 
        case true: 
        case "true": 
          return true; 
        default: 
          return false; 
      }     
    }

     extractParametersFromFunctionString(funcString : string) : Array<any> {
       var parameters = new Array<any>();
       var parametersString = funcString.split("(");
       parameters = parametersString[1].substring(0,parametersString[1].length-1).split(",");
       for (let i=0;i<parameters.length;i++) {
         if (this.isNumber(parameters[i])) {
           parameters[i] = Number(parameters[i]);
         }
         if (this.isBoolean(parameters[i])) {
           parameters[i] = Boolean(parameters[i]);
         }
       }
       return parameters;   
     }

     extractFunctionNameFromFunctionString(funcString : string) : string {
       return funcString.split("(")[0];
     }

     replaceDoubleBraces(html : string ,map : any) : string{
          return html.replace(/{{(.+?)}}/g, (_,key) : string => {
            if (map[key] === undefined) {
                return this.interpolationPrefix+this.interpolationPrefix+
                key+this.interpolationSuffix+this.interpolationSuffix;
            } else {
               return map[key];
            }
          });
     }

     //Process interpolation from html
     processInterpolation(maskedHtml : string,map : any) : string {
        return this.replaceDoubleBraces(maskedHtml,map);
     }
     
     getPath(file : string) : string {
        let path : string = "";
        let splittedString : string[] = file.split("\\");
        for (let i=0;i<splittedString.length-1;i++) {
          if (i < splittedString.length - 2) {
            path = path + splittedString[i]+"\\";
          } else {
               path = path + splittedString[i];
          }
        }
        return path;
     }
     //initialize components from module
     initializeComponentsFromModule(components : Component[],
      files : string[],spellServer : Application) : void {
      import("../app/app.module").then((mod) => {
          //Initializing App Module with SpellModule
          eval("new "+mod.AppModule+"()");
          let spellModule =  getModule();
          let routes : Routes = spellModule.getImports();
          let allRoutes : any = routes[0];
          routes = allRoutes;
          //Code to initializing Objects of Components
          for (let i=0;i<files.length;i++) {
            for (let j=0;j<routes.length;j++) {
              if (module.declarations[i] == routes[j].component) {
                let obj : any = eval("new "+module.declarations[i]+"()");
                components[i].setInstance(obj);
                components[i].setPath(this.getPath(files[i]));
                let keys = Object.keys(obj);
                components[i].setKeys(keys);
                components[i].setUri(routes[j].path);
              }
            }
          }
          for (let i=0;i<components.length;i++) {
            mapUriWithComponents(components[i].getUri(),components[i],components);
          }
      }).catch((e) => {
         console.log("Error occured initializing Module "+e);
         return;
      });
    }

    //Scan All folders and get components
    scanModulesAndBuildComponents(components : Component[],spellServer : Application) : void {
      let arr : string[] = new Array<string>();
      let files : string[] = new Array<string>();
      getAllFiles("./src/app",arr);
      for (let i=0;i<arr.length;i++) {
        if (arr[i].endsWith(".ts") && arr[i].indexOf("app.module.ts") == -1) {
          files.push(arr[i]);
        } 
      }
      for (let i=0;i<files.length;i++) {
        //Restructring folder name
        let splittedString : string[] = files[i].split("\\");
        let location = "";
        for (let j=0;j<splittedString.length;j++) {
            if (j==2 || j==3) continue;
            if (j == splittedString.length-1) location = location + splittedString[j];
            else location += splittedString[j] + "\\";
        }
        files[i] = location;
      }
      this.initializeComponentsFromModule(components,files,spellServer);
    }
}

//Utility function to recursively scan all the files
const getAllFiles = function(dirPath : any, arrayOfFiles : any) : string[]{
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  });
  return arrayOfFiles
}
