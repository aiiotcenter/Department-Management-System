const db = require('../Database_connection');

// Fetch all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching announcements' });
  }
};

// Insert a new announcement
exports.createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
   try {
    const [result] = await db.query(
      'INSERT INTO announcements (title, content, created_at) VALUES (?, ?, NOW())',
      [title, content]
    );
    res.status(201).json({ message: 'Announcement created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating announcement' });
  }
};

// Edit an existing announcement
exports.editAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE announcements SET title = ?, content = ? WHERE Announcement_ID = ?',
      [title, content, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating announcement' });
  }
}; 

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM announcements WHERE Announcement_ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting announcement' });
  }
};
