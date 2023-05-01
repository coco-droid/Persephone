const fs = require('fs');
const memory=require("./memory.js");
const {GPT4} = require("./GPT4.js");
const path = require('path');
const {run}=require("./run.js");
const runner=new run();
//console.log(memory);
//create task class
class Task {
constructor(text,name){
  this.name=name;
  this.prompt=text;
  this.text=text;
  this.gpt4=new GPT4("sk-");
}
initialize()
{
    //create task in memory
    memory.memlist(this.name,this.prompt,
        async function(docs)
        {
            console.log('executed');
            await this.getGoal(async function(){
              await this.generateTasks(this.name);
            }.bind(this));
        }.bind(this)
        );}
tasktojson(text) {
    // 
    function getJsonBetweenTags(text, startTag, endTag) {
     // Get the start and end index of the start tag.
     const startIdx = text.indexOf(startTag);
     const endIdx = text.indexOf(endTag, startIdx + startTag.length);
   
     // If the start or end tag is not found, return null.
     if (startIdx === -1 || endIdx === -1) {
       return null;
     }
   
     // Get the text between the start and end tags.
     const jsonText = text.substring(startIdx + startTag.length, endIdx);
   
     var tasks=JSON.parse(jsonText);
     // Return the tasks object.
     return tasks;
   }
    var t=getJsonBetweenTags(text, "<object-start>", "<object-end>");
    console.log(t);
    return t;
 }
 
 async   generateTasks(name){
        var goal=this.getGoal(this.text);
       await  this.gpt4.generateTasks(goal.text-goal,goal.factor,goal.final).then((response) => {
            console.log(response);
            memory.memlistupdate(name,"status","generated");
            memory.savedatainjson(name,this.tasktojson(response),function(docs){
                 memory.memlistupdate(name,"status","saved");
                 runner.name=this.name;
                 runner.start(name);
            }.bind(this));      
        });
    }
   async getGoal(call=function(){console.log('default')}){
        //interrogate gpt4 for to get the goal
        var goal= await this.gpt4.interrogateGPT4(`
        Please use the following example to analyze the text "[how to cook]":
[ text to analyze :"how to go in mars"
  response of analyze:<object-start>{ "text-goal": "explain the process of going to Mars", "factors": "the technology required to travel to Mars, the cost of traveling to Mars, and the risks involved in traveling to Mars", "category": "science" "final":"a text conclusion about the text" }<object-end>]

Identify the following for the text "[${this.prompt}}]":
- The text's goal
- The factors
- The category of the text
- The final is the end of the goal and can be a text or an image or a video or an audio or a code or a link or a file or a trading task or a web task or other thing.

Return your response as a JSON object with <object-start> before and <object-end> in the end of the JSON." `);


    
    //get the object between the tags
     var jsonText = this.tasktojson(goal);
     //save result in memlist.json in prelude field 
     memory.memlistupdate(this.name,"prelude",jsonText);
     call()
    }

}
module.exports = {Task};
