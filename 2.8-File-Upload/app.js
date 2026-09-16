const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = 5000;

// Make the uploads folder accessible on the weeb as a place with static files
app.use(express.static(path.join(__dirname, "uploads")));

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid conflicts
    // Developer Human Friendly file name - normally a random string with no extension
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// New instance of multer file handler along with options - ie storage object
const upload = multer({
    storage: storage,
    limits: { fileSize: 2*1024*1024/8 } // calulate file size using 1024 bytes per kb
});

// Set up handlebars template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Route to show form
app.get("/", (req, res) => {
  res.render("form", {
    // In this case the form template only has a file input
    // Which can not be set due to browser security concerns
    // So no data is sent
  }); // loads form.handlebars
});

// Route to handle upload
// Route uses the same as the form action in the template
app.post(
  "/upload",
  upload.single("myFile"), // Multer middleware to handle file upload and modify the request object
  (req, res) => {
    // At this point multer modified the req object so it now has req.file
    res.send(`File uploaded successfully: ${req.file.originalname}`);
  },
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
