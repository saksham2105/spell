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
    func : string = "updateName('Sahil')";
    score : number = 10;
    constructor() {
        console.log("AppComponent constructor being invoked");
    }
    ngOnInit() {
       console.log(Object.getOwnPropertyNames(this));
    }
    incrementScore() {
        this.score ++;
    }
    getTrainingName(){
        console.log("Training name is "+this.title);
    }
    updateName(name : string) {
        this.incrementScore();
        this.name = name;
    }
    updateTitle(title : string) {
        this.title = title;
    }
    setTitle(title : string) {
        this.title = title;
    }
  }
  
