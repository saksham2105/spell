import {Response} from "express";

import fs, { read } from 'fs';

import path from "path";

import conf from "../../package.conf.json";
import { Component } from "../libs/Component";

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

     processInterpolation(maskedHtml : string,map : any) : string {
        return this.replaceDoubleBraces(maskedHtml,map);
     }

     scanModulesAndBuildComponents(components : Component[]) : void {
      let arr : string[] = new Array<string>();
      let filesArray : string[] = new Array<string>();
      const files = getAllFiles("./src",arr);
      for (let i=0;i<arr.length;i++) {
        if (arr[i].indexOf("server\\spell.server.ts") == -1 && 
        arr[i].indexOf("server\\spell.server.util.ts") == -1 && 
        arr[i].indexOf("libs\\Component.ts") == -1 &&
        arr[i].indexOf("libs\\ComponentDecorator.ts") == -1 &&
        arr[i].endsWith(".ts")) {
          filesArray.push(arr[i]);
        } 
      }
      for (let i=0;i<filesArray.length;i++) {
        let splittedString : string[] = filesArray[i].split("\\");
        let location = "";
        for (let j=0;j<splittedString.length;j++) {
            if (j==2 || j==3) continue;
            if (j == splittedString.length-1) location = location + splittedString[j];
            else location += splittedString[j] + "\\";
        }
        filesArray[i] = location;
      }
      console.log(filesArray);
      for(let i=0;i<filesArray.length;i++) {
        let cls = filesArray[i];
        if (cls.indexOf("app.component.ts") != -1) {
          console.log("Ander aaya");
          import(cls).then((module) => {
            var obj : any = eval("new "+module.AppComponent+"()");
            components[i].setInstance(obj);
            var keys = Object.keys(obj);
            components[i].setKeys(keys);
          }).catch((e) => {
             console.log("Error "+e);
          });    
    
        }
      }
    }
}

const getAllFiles = function(dirPath : any, arrayOfFiles : any) : string[]{
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })
 return arrayOfFiles
}