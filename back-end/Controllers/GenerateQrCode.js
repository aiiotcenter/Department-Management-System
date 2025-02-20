const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const GenerateQrCode = async (data, qrCodeID) => {
    try {
        const qrCodePath = path.join(__dirname, '../QRcodes', `${qrCodeID}.png`);

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(qrCodePath), { recursive: true });

        // Convert data to string if it's not already
        const qrData = typeof data === 'object' ? JSON.stringify(data) : String(data);

        // Generate QR Code
        await QRCode.toFile(qrCodePath, qrData);

        console.log(`QR Code saved at: ${qrCodePath}`);
        return qrCodePath; // Return file path for reference
    } catch (error) {
        console.error('QR Code Generation Error for ID: ${qrCodeID}', error);
        throw new Error('Failed to generate QR Code');
    }
};

module.exports = GenerateQrCode;
