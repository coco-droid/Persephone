const  persephone = require('./persephone.js');
const { Command } = require('commander');
const program = new Command();

program.command('persephone')
.description('Use to talk with Agent')
.argument('<string>', 'string to split')
.option('--new goal', 'display just the first substring')
.action((str, options) => {
  //display string in console
    persephone.accomplish(str);
}); 


program.parse(process.argv);
