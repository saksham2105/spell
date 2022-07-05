import { ComponentDecorator } from "../../libs/ComponentDecorator";

@ComponentDecorator({
    selector : 'app-root',
    templateUrl : './register.component.html',
    styleUrls : ['./register.component.css']
})
export class RegisterComponent {
    title : string= "register";
    constructor() {
        console.log("Register component constructor invoked");
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
  
