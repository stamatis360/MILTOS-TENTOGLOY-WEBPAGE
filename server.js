const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
  secret: 'tentoglou_secret',
  resave: false,
  saveUninitialized: true
}));

// Simple user for demo
const ADMIN_USER = { username: 'admin', password: 'admin' };

// --- Authentication ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Λάθος στοιχεία.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(403).json({ success: false, message: 'Απαγορεύεται.' });
}

// --- Achievements CRUD ---
const achievementsPath = path.join(__dirname, 'data', 'achievements.json');

app.get('/api/achievements', (req, res) => {
  const type = req.query.type;
  fs.readFile(achievementsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json([]);
    let achievements = JSON.parse(data);
    if (type) achievements = achievements.filter(a => a.type === type);
    res.json(achievements);
  });
});

app.post('/api/achievements', requireAdmin, (req, res) => {
  const newAch = req.body;
  fs.readFile(achievementsPath, 'utf8', (err, data) => {
    let achievements = err ? [] : JSON.parse(data);
    newAch.id = Date.now();
    achievements.push(newAch);
    fs.writeFile(achievementsPath, JSON.stringify(achievements, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.put('/api/achievements/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  fs.readFile(achievementsPath, 'utf8', (err, data) => {
    let achievements = err ? [] : JSON.parse(data);
    achievements = achievements.map(a => a.id === id ? { ...a, ...updated } : a);
    fs.writeFile(achievementsPath, JSON.stringify(achievements, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.delete('/api/achievements/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(achievementsPath, 'utf8', (err, data) => {
    let achievements = err ? [] : JSON.parse(data);
    achievements = achievements.filter(a => a.id !== id);
    fs.writeFile(achievementsPath, JSON.stringify(achievements, null, 2), () => {
      res.json({ success: true });
    });
  });
});

// --- Links CRUD ---
const linksPath = path.join(__dirname, 'data', 'links.json');

app.get('/api/links', (req, res) => {
  const type = req.query.type;
  fs.readFile(linksPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json([]);
    let links = JSON.parse(data);
    if (type) links = links.filter(l => l.type === type);
    res.json(links);
  });
});

app.post('/api/links', requireAdmin, (req, res) => {
  const newLink = req.body;
  fs.readFile(linksPath, 'utf8', (err, data) => {
    let links = err ? [] : JSON.parse(data);
    newLink.id = Date.now();
    links.push(newLink);
    fs.writeFile(linksPath, JSON.stringify(links, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.put('/api/links/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  fs.readFile(linksPath, 'utf8', (err, data) => {
    let links = err ? [] : JSON.parse(data);
    links = links.map(l => l.id === id ? { ...l, ...updated } : l);
    fs.writeFile(linksPath, JSON.stringify(links, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.delete('/api/links/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(linksPath, 'utf8', (err, data) => {
    let links = err ? [] : JSON.parse(data);
    links = links.filter(l => l.id !== id);
    fs.writeFile(linksPath, JSON.stringify(links, null, 2), () => {
      res.json({ success: true });
    });
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
