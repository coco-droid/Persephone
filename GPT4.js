const { Configuration, OpenAIApi } = require("openai");

class GPT4 {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.config=configuration = new Configuration({
      apiKey: this.apiKey,
    });
    this.openai = new OpenAIApi(this.config);
  }
async interrogateGPT4(prompt) {
  const response = await this.openai.createCompletion(
    model="text-davinci-003",
    prompt=ourprompt,
    temperature=0,
    max_tokens=7
  );
  return response.data.choices[0].text;
}
  async generateTasks(prompt) {
    let ourprompt=`
    I want you to create a list of task that can be performed on the text:[${prompt}] 
Please decompose the text into as many tasks as you think is necessary to get accurate results. 
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
},{}...]},{"task2...},...
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
    const response = await this.openai.createCompletion(
      model="text-davinci-003",
      prompt=ourprompt,
      temperature=0,
      max_tokens=7
    );
    return response.data.choices[0].text;
    }
}

module.exports = GPT4;