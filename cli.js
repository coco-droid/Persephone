
const { Command } = require('commander');
const program = new Command();

program.command('persephone')
.description('Use to talk with Agent')
.argument('<string>', 'string to split')
.option('--new goal', 'display just the first substring')
.action((str, options) => {
  //display string in console
    console.log(str);
}); 
/*rewrite the precedent code in cli.js to get a result like this:
$persephone 
What would you like me to do?
--new goal: prompt

*/


program.parse(process.argv);
