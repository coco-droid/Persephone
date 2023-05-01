
const { json } = require('body-parser');
const SimpleJsonDB = require('simple-json-db');
const db = new SimpleJsonDB('./memory/memlist.json');

exports.memlist = function (name,prompt,call=function(newdoc){ console.log("done"+newdoc); }) {
  db.set(name, { "name": name, "prompt":prompt, "status": "pending", "tasks":"" });
  call(db.get('memlist'));
}

exports.savedatainjson=function(name,task,call=function(newdoc){ console.log("save"+newdoc); }) {
  //update memlist.json find by name and update tasks
  var memlist = db.get(name);
  memlist["tasks"] = task;
  db.set(name, memlist);
  call(db.get(`memlist.${name}`));
}

exports.memlistupdate=function(name,property,value,call=function(newdoc){ console.log("update"+newdoc); } ){
  const memlist = db.get(name);
  //memlist is [object Object]
  memlist[property]=value;
  db.set(name,memlist);
  call()
}

exports.memlistfind=function(name,call=function(newdoc){ console.log("done"+newdoc); } ){
  call(db.get(`${name}`));
  return db.get(`${name}`) ;
}

module.exports = exports;
/*
const nedb = require('nedb');
const db = new nedb({ filename: './memory/memlist.json', autoload: true });
exports.memlist = function (name,prompt,call=function(newdoc){
    console.log("done"+newdoc);
}) { 

db.insert( {
    "name": name,
    "prompt":prompt,
    "status": "pending",
    "tasks":""
  }, function (err, newDoc) {
    call(newDoc);
  });
}
exports.savedatainjson=function(name,task,call=function(newdoc){
    console.log("save"+newdoc);
}) 
{
  //update memlist.json find by name and update tasks 
    db.update({ name: name }, { $set: { status: 'done',tasks:task } }, {
        //restrict repetition of data 
        upsert: true

    }, function (err, numReplaced) {
        console.log(numReplaced);
        call(numReplaced);
        }
    );
}
exports.memlistupdate=function(name,property,value,call=function(newdoc){
    console.log("update"+newdoc);
}
){
    db.update({ name: name }, { $set: { [property]:value } }, {
        //restrict repetition of data
        upsert: true

    }, function (err, numReplaced) {
        console.log(numReplaced);
        call(numReplaced);
        }
    );
}
exports.memlistfind=function(name,call=function(newdoc){
    console.log("done"+newdoc);
}
){
    db.find({ name: name }, function (err, docs) {
        console.log(docs);
        call(docs);
        }
    );
}
module.exports = exports;
*/