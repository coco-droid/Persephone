const  GPT4  = require("./GPT4.js");
const { fetch } = require("node-fetch");

const apiKey = process.env.GPT4_API_KEY;

const getPrompt = () => {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
  });

  rl.question("What would you like me to do? ", (prompt) => {
    rl.close();
    return prompt;
  });
};

const main = async () => {
  const prompt = await getPrompt();

  const gpt4 = new GPT4(apiKey);
  const tasks = await gpt4.generateTasks(prompt);

  for (const task of tasks) {
    console.log("Task:", task);
  }
};

main();
