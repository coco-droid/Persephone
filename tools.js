//import google it module
const langchain = require("langchain");
const { BingChat }=require('bing-chat');
const fs = require('fs');
const GPT4 = require("./GPT4.js");
const path = require('path');
const { exec } = require('child_process');
class tools {
    constructor() {
        this.name = name;
    }
    search(keywords) {
        //search the web for the keywords
        //open the browser and search for the keywords
        //return the result
        // Create a Langchain object.
const lc = new langchain();

// Set the search engine to Google.
lc.setEngine("google");

// Set the search query.
lc.setQuery(keywords);

// Search for the query.
lc.search();

// Get the results.
const results = lc.getResults();
async function example() {
  const api = new BingChat({
    cookie: process.env.BING_COOKIE
  })

  const res = await api.sendMessage('Hello World!')
  console.log(res.text)
}
    }
    write(name,text,extension) {
        //use  interrogate 
        var res=GPT4.interrogate(`
          write a text with this instructions:
        [`+text+'] Before the text  add <object-start> in the end add <object-end>');
        //create a file with the extension
        fs.writeFile(name,res, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            return true;
        });
    }
    read() {
        //read a file
        //return the file
        var res=GPT4.interrogate(`
            read this text and resume it in least 5 sentences:
        [`+text+']');
        return res;
    }
    think() {
        //think about the task
        //return the result
        var res=GPT4.interrogate(`
            you are peter my friend and have QI of 200 and you are a genius and you are thinking about this task:${text} and you are delibering about it `);
        return res;
    }
    execute(command) {
        exec(command, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              this.execautodebug(err,stderr);
              return;
            }
            console.log(stdout);
            this.execautodebug(err,stdout);
          });
    }
    execautodebug(error,info) {
        if(error){
            var res=GPT4.interrogate(`
            you are peter my friend and your a genius in coding and you are debugging this code:${text} and you are delibering about it`);
            return res;
        }
        else{
            console.log(info);
        }
    }
}
//export the tools class
module.exports = tools;