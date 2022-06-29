import express,{Application,Request,Response,NextFunction} from "express";

import {SpellServerUtil} from "./spell.server.util";

const getNewServerUtilInstance = () => new SpellServerUtil();

const spellServerUtil : SpellServerUtil = getNewServerUtilInstance(); 

const spellServer : Application = express();

spellServer.get('/',(request : Request ,response : Response,
    next : NextFunction) => {
    response.send("Hello");
});

spellServer.listen(spellServerUtil.getPort(), () => {
    console.log(`Server is running on port ${spellServerUtil.getPort()}`);
});