const express = require('express');
const router = express.Router();
const announcementController = require('../../Controllers/Announcement_controller');
const { protect, authRole, ExtractJWTData } = require('../../Authentication_Middleware');

// GET all announcements - require authentication
router.get('/', protect, announcementController.getAllAnnouncements);

// POST a new announcement - require authentication and admin role
router.post('/', protect, ExtractJWTData, authRole, announcementController.createAnnouncement);

// PATCH (edit) an announcement - require authentication and admin role
router.patch('/:id', protect, ExtractJWTData, authRole, announcementController.editAnnouncement);

// DELETE an announcement - require authentication and admin role
router.delete('/:id', protect, ExtractJWTData, authRole, announcementController.deleteAnnouncement);

module.exports = router; 