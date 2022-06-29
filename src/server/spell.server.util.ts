import {Response} from "express";
import config from "../../package.conf.json";
import fs from 'fs';

export class SpellServerUtil {
      
     interpolationSuffix : string = "}";
     interpolationPrefix : string = "{";

     constructor() {
     }

     serveStaticContent(file : any,response : Response) : void {
          fs.readFile(file,'utf8',(err , data  : string) => {
            response.send(this.processInterpolation(data,config));
              if (err) {
               throw err;
              }
          });  
     }

     getPort() : number {
        return config.port;
     }

     getResourcesDir() : String {
       return config.resources;
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
}
  