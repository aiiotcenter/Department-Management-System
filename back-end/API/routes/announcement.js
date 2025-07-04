const express = require('express');
const router = express.Router();
const announcementController = require('../../Controllers/Announcement_controller');

// GET all announcements
router.get('/', announcementController.getAllAnnouncements);

// POST a new announcement
router.post('/', announcementController.createAnnouncement);

// PATCH (edit) an announcement
router.patch('/:id', announcementController.editAnnouncement);

module.exports = router; 