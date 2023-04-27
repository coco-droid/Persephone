/*task in json file exemple:
{
"task1": {
"name": "Install Node.js",
"description": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side. To install Node.js, go to the official website and download the installer for your operating system.",
"subtasks": [
{
"name": "Download Node.js",
"description": "Go to the official Node.js website and download the installer for your operating system.",
"command": "Search",
"keywords":"node.js download"
},
{
"name": "Install Node.js",
"description": "Run the installer and follow the instructions to install Node.js on your computer.",
"command": "Execute"
}
],
"linear": true
},
"task2": {
"name": "Create a new file",
"description": "Create a new file with a .js extension. This will be the file where you write your 'Hello World' program.",
"subtasks": [
{
"name": "Create a new file",
"description": "Open your text editor and create a new file with a .js extension.",
"command": "Write",
"extension":".js"
}
],
"linear": true
},
"task3": {
"name": "Write 'Hello World' program",
"description": "Write the 'Hello World' program in the file you created in task 2.",
"subtasks": [
{
"name": "Write 'Hello World' program",
"description": "Open the file you created in task 2 and write the following code: console.log('Hello World');",
"command": "Write"
}
],
"linear": true
},
"task4":{
"name":"Run the program",
"description":"Run the 'Hello World' program using Node.js.",
"subtasks":[
{
"name":"Open terminal or command prompt",
"description":"Open terminal or command prompt on your computer.",
"command":"Execute"
},
{
"name":"Navigate to directory containing file",
"description":"Navigate to the directory where you saved the file created in task 2.",
"command":"Execute"
},
{
"name":"Run the program",
"description":"Type 'node filename.js' in terminal or command prompt and press enter. Replace filename with the name of your file.",
"command":"Execute"
}
],
"linear":true
}
}
*/
class run {
     constructor(name){
            this.name=name;
        }
        start(){
            //get the json file 
            var task = fs.readFileSync(this.name, 'utf8');
            //parse the json file
            var task = JSON.parse(task);
            //will  execute all the subtasks in the task in order 
            //get all the task in the json file in order
            var tasks = Object.keys(task);
            //loop through all the task in the json file
            for (var i = 0; i < tasks.length; i++) {
                 //get the subtask in the task
                var subtasks = task[tasks[i]]["subtasks"];
                //loop through all the subtask in the task
                for (var j = 0; j < subtasks.length; j++) {
                    /* command: is a required field for all sub-task value Add "Read, Write, Search, Think, Execute" in the command field if subtask requires any of these actions the field can have one of them.
                      detect the command in the subtask and execute the command exemple: if the command is "Search"  execute tools.search(subtask["keywords"])
                    */
                    if (subtasks[j]["command"] == "Search") {
                        tools.search(subtasks[j]["keywords"]);
                    }
                    if (subtasks[j]["command"] == "Write") {
                        tools.write(subtasks[j]["extension"]);
                    }
                    if (subtasks[j]["command"] == "Read") {
                        tools.read();
                    }
                    if (subtasks[j]["command"] == "Think") {
                        tools.think();
                    }
                    if (subtasks[j]["command"] == "Execute") {
                        tools.execute();
                    }
                }
            }
        }
}