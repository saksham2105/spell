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
      
     interpolationSuffix : string = "}";
     interpolationPrefix : string = "{";
     constructor() {
     }

     serveStaticContent(file : any,response : Response,config : any) : void {
          fs.readFile(file,'utf8',(err , data  : string) => {
            var document = parse(data);
            var elems = document.getElementsByTagName("*"); //Getting all elements
            response.send(this.processInterpolation(data,config));
              if (err) {
               throw err;
              }
          });  
     }

     serveStaticContextFromText(html : string,response : Response,config : any) : void {
       response.send(this.processInterpolation(html,config));
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