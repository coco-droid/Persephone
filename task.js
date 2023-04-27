const fs = require('fs');
const GPT4 = require("./GPT4.js");
const path = require('path');
const run=require("./run.js");
//create task class
class Task {
constructor(text){
  this.text=text;
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
}