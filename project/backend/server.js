require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const cookieSession = require('cookie-session');

const queueRoutes = require('./src/routes/queueRoutes');
const userRoutes = require('./src/routes/userRoutes');
require('./src/passport'); // passport strategy

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', methods: ['GET','POST'] }
});

// simple attach io to req
app.use((req, res, next) => { req.io = io; next(); });

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// cookie session for passport (keeps flow simple)
app.use(cookieSession({
  name: 'session',
  keys: [process.env.JWT_SECRET || 'keyboardcat'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth routes (Google)
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    // On success, passport put user on req.user (with token)
    // We'll redirect to frontend with token in query
    const token = req.user.token;
    const redirect = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?token=${token}`;
    return res.redirect(redirect);
  }
);

app.get('/auth/failure', (req, res) => res.status(401).json({ ok: false, message: 'Auth failed' }));

// API routes
app.use('/api/queues', queueRoutes);
app.use('/api/users', userRoutes);

// health
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

// socket events
io.on('connection', socket => {
  console.log('Socket connected', socket.id);
  socket.on('joinVenue', venueId => {
    socket.join(venueId);
  });
});

// DB + start
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongo');
    const port = process.env.PORT || 5000;
    server.listen(port, () => console.log(`Server running on ${port}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
