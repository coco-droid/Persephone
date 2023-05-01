const {Task} = require('./task.js');
class persephone {
   constructor(prompt,name)
   {
     this.prompt=prompt;
     this.name=name;
     this.task=new Task();
   }
   accomplish()
   {
     this.task.prompt=this.prompt;
     this.task.name=this.name;
     this.task.initialize(this.prompt,this.name);
   }
}
module.exports = {persephone};