const express = require("express");

const app = express();
const port = 3000;

// search route
app.get('/search', (req, res) => {
  const { title, author } = req.query;
  console.log("Entire Request Query Object: ", req.query)

  if (!title || !author) {
    return res.send("Please enter both title and author.");
  }
  // Typically res.send is only used for quick debugging
  res.send(`Searching for books titled "${title}" by ${author}`);
  //normally if we coded our own api we would query a real database and res.json the data from the db
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});