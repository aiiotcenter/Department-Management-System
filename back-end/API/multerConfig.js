const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/cvs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Sanitize filename to prevent directory traversal attacks
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = uniqueSuffix + '-' + sanitizedName;
        cb(null, filename);
    },
});

// File filter to validate files - SECURITY ENHANCED
const fileFilter = (req, file, cb) => {
    // Define allowed MIME types for CV uploads
    const allowedMimeTypes = [
        'application/pdf',                    // PDF files
        'application/msword',                 // DOC files
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files
        'text/plain'                          // TXT files
    ];

    // Define allowed file extensions
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    
    // Get file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Check both MIME type and file extension
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed for CV uploads.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1                    // Only allow 1 file at a time
    }
});

module.exports = upload;
