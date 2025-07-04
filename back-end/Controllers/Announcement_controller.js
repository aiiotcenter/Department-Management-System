const db = require('../Database_connection');

// Fetch all announcements
exports.getAllAnnouncements = (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY Created_At DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json(results);
  });
};

// Insert a new announcement
exports.createAnnouncement = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.query(
    'INSERT INTO announcements (Title, Content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err });
      }
      res.status(201).json({ message: 'Announcement created', id: result.insertId });
    }
  );
};

// Edit an existing announcement
exports.editAnnouncement = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.query(
    'UPDATE announcements SET Title = ?, Content = ? WHERE Announcement_ID = ?',
    [title, content, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      res.json({ message: 'Announcement updated' });
    }
  );
}; 