import { ComponentDecorator } from "../libs/ComponentDecorator";


@ComponentDecorator({
    selector : 'app-root',
    templateUrl : 'app.component.html',
    styleUrls : ['app.component.css']
})
export class AppComponent {
    title : string= "Spell";
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
  
