//executed when user run npm run server port 
const express = require('express');
const app = express();
const persephone=require('./persephone.js');
//body parser
const bodyParser = require('body-parser');
//get the port in the command 
const port = process.argv[2];
//get the path of the current directory
const path = require('path');
//get the fs module
const fs = require('fs');
//create a server
const server = require('http').createServer(app);
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})
//start the server
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
