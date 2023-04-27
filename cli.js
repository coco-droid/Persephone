
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
program.parse(process.argv);
