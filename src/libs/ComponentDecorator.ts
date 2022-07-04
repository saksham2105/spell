import { Component } from "./Component";

import { addComponent } from "../server/spell.server";

export function ComponentDecorator(obj : any) {
   return function(target : any) {
     let selector : string = obj["selector"];
     let templateUrl : string = obj["templateUrl"];
     let styleUrls : string[] = ["./app.component.css"]; 
     let component = new Component();
     component.setSelector(selector);
     component.setStyleUrls(styleUrls);
     component.setTemplateUrl(templateUrl);
     addComponent(component);
   }
}
