import { ComponentDecorator } from "../libs/ComponentDecorator";


@ComponentDecorator({
    selector : 'app-root',
    templateUrl : 'app.component.html',
    template : "<div style='color:red;'>{{name}}</div>",
    styleUrls : ['app.component.css']
})
export class AppComponent {
    title : string= "Spell";
    name : string = "Saksham";
    isEmployed : boolean = true;
    constructor() {
        console.log("AppComponent constructor being invoked");
    }
    ngOnInit() {
       console.log(Object.getOwnPropertyNames(this));
    }
    getTrainingName(){
        console.log("Training name is "+this.title);
    }
    setTitle(title : string) {
        this.title = title;
    }
  }
  
