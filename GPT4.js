const { Configuration, OpenAIApi } = require("openai");
const{ BingChat } =import('bing-chat');


async function  attemptd(prompt) {
  //const api = new BingChat({
  //  cookie: process.env.BING
  //})
  console.log(prompt);
  //const res = await api.sendMessage(prompt).then((res) => {
   // console.log(res);
  //})
  ;
  //console.log(res)
  return `Here is the analysis of the text “[how to cook salade]”: <object-start>{
    "text-goal": "explain how to cook salad",
    "factors": "the ingredients required to make a salad, the preparation steps for making a salad, and the dressing options for a salad",
    "category": "food",
    "final": "You can find more information on how to make a salad at the current web page context."
  } <object-end>`;
}
class GPT4 {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.config= new Configuration({
      apiKey: this.apiKey,
    });
    this.openai = new OpenAIApi(this.config);
  }
async interrogateGPT4(prompt) {
  /*const response = await this.openai.createCompletion(
    model="text-davinci-003",
    prompt=ourprompt,
    temperature=0,
    max_tokens=7
  );
  return response.data.choices[0].text;*/
  return await attemptd(prompt);
}
  async generateTasks(goal,factor,Finally) {
    let ourprompt=`
    Please provide me with a list of tasks that are necessary to  ${goal}. Consider ${factor}. Finally, please include a task ${Finally}.
Please return your responses in an json structure like this: 

{
"task1": {
"name": "title for them ",
"description": "This is the description of task 1",
"subtasks": [
{
"name": "title for them ",
"description": "This is the description of subtask 1",
"command": "Search"
"keywords":"the search query to find information about this"
},{}...]},"task2":{}..."End{description: "end task description dependable of final input",command:""...}}
The following properties are found in the subtask object:
name: is a required field for all sub-task value The name of the subtask.
description: is a required field for all sub-task value The description of the subtask.
command: is a required field for all sub-task value Add "Read, Write, Search, Think, Execute" in the command field if subtask requires any of these actions the field can have one of them.
keywords: is a required field for sub-task with Read and Search command  value The keywords that are used to search for information about the subtask.
remember: necessary in some case value A boolean value remembering subtask precedent or other to get information to accomplish this subtask exemple remember:subtask1
linear: is a required field for all sub-task value a boolean true if this substack can introduce new substack like a paradigm change for accomplish a goal and false in other case  
output: is necessary in some case to get a specific information like if the substack need a preference or some information to accomplish
extension:is a required field for all sub-task with Write command value one of them's extesion:'.txt,.py,.js other text and code extesion 
 Before the object add <object-start> in the end add <object-end>
    `;
   /* const response = await this.openai.createCompletion(
      model="text-davinci-003",
      prompt=ourprompt,
      temperature=0,
      max_tokens=7
    );
    return response.data.choices[0].text;
    }*/
    return `Sure, I can help you with that. Here is a list of tasks that are necessary to explain how to cook salad. 

    <object-start>
    {
      "tasks": [
        {
          "name": "Ingredients",
          "description": "This task will list the ingredients required to make a salad.",
          "subtasks": [
            {
              "name": "Greens",
              "description": "Choose your greens. Some popular options include lettuce, spinach, kale, and arugula.",
              "command": "Read",
              "linear": true
            },
            {
              "name": "Vegetables",
              "description": "Choose your vegetables. Some popular options include tomatoes, cucumbers, carrots, and bell peppers.",
              "command": "Read",
              "linear": true
            },
            {
              "name": "Protein",
              "description": "Choose your protein. Some popular options include chicken, shrimp, tofu, and hard-boiled eggs.",
              "command": "Read",
              "linear": true
            },
            {
              "name": "Extras",
              "description": "Choose any extras you want to add. Some popular options include nuts, seeds, cheese, and croutons.",
              "command": "Read",
              "linear": true
            }
          ]
        }
        
      ]
    }
    
    
    <object-end>
    
    I hope this helps! Let me know if you have any questions.`;
  }
}

module.exports = {GPT4};