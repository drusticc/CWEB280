// CommonJS
const express = require("express");

const app = express(); // factory make an express object -name it app
const port = 3000; // used in http://localhost:3000 url

app.get("/", (req, res)=>{ 
    // req is a JS object that contains all the info the browser sent to the server
    // res is the response object that handles what is returned to the browser
    res.send("Hello Hudson");
});

app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
});