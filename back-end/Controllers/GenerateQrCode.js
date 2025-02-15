const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const qrFolderPath = path.join(__dirname, '../QRCodes'); // Adjust path if needed

// Ensure the folder exists
if (!fs.existsSync(qrFolderPath)) {
    fs.mkdirSync(qrFolderPath, { recursive: true });
}

// Function to generate QR code and save it in the folder
const GenerateQrCode = async (data, filename) => {
    try {
        const filePath = path.join(qrFolderPath, `${filename}.png`);
        await QRCode.toFile(filePath, data); // Generates and saves the QR code
        console.log(`QR Code saved at: ${filePath}`);
        return filePath; // Return the path for database storage
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

module.exports = GenerateQrCode;
