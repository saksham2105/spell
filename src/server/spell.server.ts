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

spellServer.get(config.startMapping,(request : Request,
    response : Response,next : NextFunction) => {
     spellServerUtil.scanModulesAndBuildComponents(components);
     let map : any = {};
     spellServerUtil.serveStaticContent(process.cwd()+"/src/app/app.component.html",response,map);
});

spellServer.listen(spellServerUtil.getPort(), () => {
    console.log(`Server is running on port ${spellServerUtil.getPort()}`);
});
