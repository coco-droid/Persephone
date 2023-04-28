const fs = require('fs');
const GPT4 = require("./GPT4.js");
const path = require('path');
const run=require("./run.js");
//create task class
class Task {
constructor(text){
  this.text=text;
  this.gpt4=new GPT4("sk-");
}
initialize()
{
    //get the goal in the prompt    
    var goal=this.getGoal(this.text);
}
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
   
 }
   savedatainjson(name,json){
    //generate a random name for file
    
        fs.writeFile(`${name}`, json, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    });
   }
    memlist(prompt){
        /*this function return a list of task and information about them is pending or done  this have this structure:
        [
            {
                "name": "title for them ",
                "prompt": "This is the prompt of task 1",
                "status": "pending"
                "filename":"the name of file that contain the task"
            },
            {
                "name": "title for them ",
                "prompt": "This is the prompt of task 2",
                "status": "done"
                "filename":"the name of file that contain the task"
            }
        ] 
        */
        var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        //create or get the memlist.json file 
        var memlist = fs.readFileSync('memlist.json', 'utf8');
        //parse the memlist.json file
        var memlist = JSON.parse(memlist);
        //save the new prompt in memlist.json with other information
        memlist.push({
            "name": name,
            "prompt": prompt,
            "status": "pending",
            "filename":""
        });
        //save the new memlist.json file
        fs.writeFile('memlist.json', JSON.stringify(memlist), function(err) {   
            if (err) throw err;
            console.log('complete');
        });
    this.generateTasks(prompt,name);
    }
    generateTasks(prompt,name){
        var gpt4 = new GPT4("sk-");
        gpt4.generateTasks(prompt).then((response) => {
            console.log(response);
            var ol=this.savedatainjson(name,response);
            if(ol){
                this.updatememlist("filename",name);
                run.start(name);
            }
            //else add status failed to memlist.json
            else{
                this.updatememlist("status","failed");
            }
             
        });
    }
    updatememlist(property,value){
        //create or get the memlist.json file 
        var memlist = fs.readFileSync('memlist.json', 'utf8');
        //parse the memlist.json file
        var memlist = JSON.parse(memlist);
        //save the new prompt in memlist.json with other information
        memlist[property]=value;
        //save the new memlist.json file
        fs.writeFile('memlist.json', JSON.stringify(memlist), function(err) {   
            if (err) throw err;
            console.log('complete');
        });
    }
    getGoal(prompt){
        //interrogate gpt4 for to get the goal
        var goal=this.gpt4.interrogateGPT4(`
        analyze the text "how to go in mars" and identify the following:
     * The text's goal
     * The factors 
     * The category of the text
     * The final  is the end of the goal is can be a text or a image or a video or a audio or a code or a link or a file or a trading task a web task other thing
     response of analyze:
     <object-start>{
        "text-goal": "explain the process of going to Mars",
        "factors": "the technology required to travel to Mars, the cost of traveling to Mars, and the risks involved in traveling to Mars",
        "category": "science"
        "final":"a text conclusion about the text"
        }<object-end>
    like the precedent example analyze the text:[${prompt}] and return response like "<object-start>{...}<object-end>"`);

    }
}