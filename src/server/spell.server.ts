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
    spellServerUtil.serveStaticContent(process.cwd()+"/src/resources/spell.html",response,config);    
});

spellServer.get('/app',(request : Request,
    response : Response,next : NextFunction) => {
    spellServerUtil.scanModulesAndBuildComponents(components);
    // let pkg : string = "C:\\spell\\src\\app\\app.component.ts" ;   
    // import(pkg).then((module) => {
    //     for (let i=0;i<components.length;i++) {
    //         var obj : any = eval("new "+module.AppComponent+"()");
    //         components[i].setInstance(obj);
    //         var keys = Object.keys(obj);
    //         components[i].setKeys(keys);
    //     }
    //     for (let i=0;i<components.length;i++) {
    //         console.log(components[i]);
    //     }
        // for (let i = 0; i < keys.length ;i++) {
        //     console.log(keys[0]);
        //     console.log(obj[keys[0]]);        
        // }
//     }).catch((e) => {
//        console.log("Error "+e);
//     });    
     let map : any = {};
     spellServerUtil.serveStaticContent(process.cwd()+"/src/app/app.component.html",response,map);
});

spellServer.listen(spellServerUtil.getPort(), () => {
    console.log(`Server is running on port ${spellServerUtil.getPort()}`);
});
