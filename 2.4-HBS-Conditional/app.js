const express = require('express');
const app = express();
const exphbs = require("express-handlebars");
const port = 8080;

//configure the template engine so it can find and read the template file
//and also replace the place holders
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); //look for the templates in the views folder

//declare a get handler for http://localhost:3000
// can gave as many handlers as you want (req,res)=>{}, (req, res)=>{}, ...
app.get("/", (req,res)=>{
    //res.render calls the template engine to open the template
    //files and replace the placeholders with actual values
    res.render("home",
        {
            title: "Home",
            loggedIn: true,
            students: ["Nib", "Terran", "Gavo"]
        }
    )
});

app.get("/iffers", (req, res)=>{
    res.render("conditional",
        {
            title: "Log in",
            isLoggedIn: false,
            username: "",
            students: ["Nib", "Terran", "Gavo"]
        }
    )
});

app.get("/racetrack", (req, res)=>{
    res.render("iterators",
        {
            title: "Iterators",
            todos: [{ task: 'Poop', completed: true },
                    { task: "Clean supper", completed: false},
                    {task: "Dog poop", completed: true}]
        }
    )
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});