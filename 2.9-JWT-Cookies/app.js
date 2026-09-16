const express = require('express');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;

const SECRET_KEY = 'mysecret';

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parse cookies

// Serve login page
app.get('/', (req, res) => {
  res.render('form');
});

// Login route (sets JWT in cookie)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Normally we check the username and password against a db
  // But for this case we hard code for admin and 1234
  if (username === 'admin' && password === '1234') {
    // The payload that we want to store in the JWT it. { username }
    // Default encryption is h256 - easily cracked
    // the options like when to expire the JWT ie. { expiresIn '1h' }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    // Token is a really long string - encrypted text

    // Set token in HttpOnly cookie
    // Server sends a header to the browser which instructs to set a cookie key value pair
    res.cookie('token', token, {
      httpOnly: true, // Broswers JS engine cannot read this cookie
      secure: false, // set true if using HTTPS
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route (reads JWT from cookie)
app.get('/api/data', authenticateTokenFromCookie, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected data!` });
});

// Logout route (clears cookie)
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully!' });
});

// Middleware to authenticate JWT from cookie
function authenticateTokenFromCookie(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});