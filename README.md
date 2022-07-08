## Spell JS Framework

A Typescript based framework for MVC web developement,
It enables virtual DOM by replicating real DOM
in memory (it prepares a data structure on express server 
startup).

A developer can create exportable Typescript classes
and map those classes using various decorators such as 
@Component(selector='',template='') @SpellModule(imports='',bootstrap='') 
etc to tell express server to recognize this decorated classes and keep
them as part of virtual DOM.

A developer can enable string interpolation by using
expression language ({{key}}) at html side, and keep the value of 
key updated using typescript code {{key}} will be replaced by key variable used at
Typescript end.Once the value of thess variable changes rest api call gets placed to express server
to updates virtual dom accordingly and rerender updated values at html side.

It supports directives such as (click) (same as angular)
,spellModel (2 way binding like angulars ngModel)
(change) (angulars change directive) to perform various event listener by means
of REST Api calls to update the virtual DOM when event gets triggered.

