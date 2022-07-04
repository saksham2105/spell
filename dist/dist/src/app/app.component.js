"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
class AppComponent {
    constructor() {
        this.title = "Spell";
        console.log("Constructor is being called");
        //var btn : any = document.getElementById("coolbutton");
        // btn.addEventListener("click", (e:Event) => this.getTrainingName());
    }
    ngOnInit() {
        console.log(Object.getOwnPropertyNames(this));
    }
    getTrainingName() {
        console.log("Training name is " + this.title);
    }
    setTitle(title) {
        this.title = title;
    }
}
exports.AppComponent = AppComponent;
