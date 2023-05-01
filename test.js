const {persephone}=require('./persephone.js');
const fs = require('fs');
const ai= new persephone('how to cook salade',"test");
ai.accomplish();
//ceate texte.txt file and write the text in it
 /*fs.writeFile('memlist.json', 'Hello content!', function (err) {
//     if (err) throw err;
//     console.log('Saved!');*/
  // });
 