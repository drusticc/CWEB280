const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route: Show form
app.get('/', (req, res) => {
  res.render('form',
    // date for placeholders is empty the first time we visit the page
    { errors: [],
        oldInput: {}
    });
});

// Route: Handle form submission with validation
app.post('/register',
  [ // set up validation checkers "rules" --- does not enforce validation
    body('email')
      .isEmail().withMessage('Invalid email format'),
    body('pwd')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age')
      .isInt({ min: 18 }).withMessage('You must be at least 18 years old')
      // you can mix and match validators for query, cookies, params, headers, and body
  ],
  (req, res) => {
    // ACTUALLY run the rules to check for invalid data
    const errors = validationResult(req);
    console.log("Entire Errors Object: ", errors);

    // ENFORCE the roles
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render('form', { 
        errors: errors.array(),
        oldInput: req.body
      });
    }

    // If valid → show success page
    res.render('success', { data: req.body });
  }
);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));