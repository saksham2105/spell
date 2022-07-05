import {Response} from "express";

import fs, { read } from 'fs';

import path from "path";
import { isBooleanObject, isNumberObject } from "util/types";

import conf from "../../package.conf.json";
import { Component } from "../libs/Component";
import { SpellModule } from "../libs/SpellModule";

var module : SpellModule = new SpellModule();

export const setModule = (mod : SpellModule) => {
  module = mod;
};

export class SpellServerUtil {
      
     interpolationSuffix : string = "}";
     interpolationPrefix : string = "{";

     constructor() {
     }

     serveStaticContent(file : any,response : Response,config : any) : void {
          fs.readFile(file,'utf8',(err , data  : string) => {
            response.send(this.processInterpolation(data,config));
              if (err) {
               throw err;
              }
          });  
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
     
     //initialize components from module
     initializeComponentsFromModule(components : Component[],
      files : string[]) : void {
      import("../app/app.module").then((mod) => {
          //Initializing App Module with SpellModule
          eval("new "+mod.AppModule+"()");
          //Code to initializing Objects of Components
          for (let i=0;i<files.length;i++) {
            import(files[i]).then((m) => {
              var obj : any = eval("new "+module.declarations[i]+"()");
              components[i].setInstance(obj);
              var keys = Object.keys(obj);
              components[i].setKeys(keys);
            }).catch((err) => {
               console.log("Error "+err);
            });
          }
      }).catch((e) => {
         console.log("Error occured initializing Module "+e);
         return;
      });
    }

    //Scan All folders and get components
    scanModulesAndBuildComponents(components : Component[]) : void {
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
      this.initializeComponentsFromModule(components,files);
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