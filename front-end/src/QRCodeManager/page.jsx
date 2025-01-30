import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/QRCodeManager.css";

const QRCodeManager = () => {
  // State for user input
  const [studentName, setStudentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [comments, setComments] = useState("");
  const [qrData, setQrData] = useState(null); // store QR data after submission
  const [scannedData, setScannedData] = useState(null); // store scanned QR data

   // Generate QR Code when the user submits the form
   const handleGenerateQR = () => {
    if (studentName && purpose && timeSlot) {
      setQrData({ studentName, purpose, timeSlot, comments });
    } else {
      alert("Please fill in all required fields.");
    }
   };

   //function to check if the current time is within the approved time slot
   const isValidTimeSlot = (TimeSlot) => {
    const currentTime = new Date();
    const [startTime, endTime] = timeSlot.split(" - ").map((time) => {
      const[hours, minutes, period] = time.split(/[:\s]/);
      let adjustedHours = parseInt(hours);
      if (period === "PM" && adjustedHours < 12) adjustedHours += 12;
      return new Date(currentTime.setHours(adjustedHours, minutes, 0, 0));
    });

    return currentTime >= startTime && currentTime <= endTime;

   };

   // QR Code Scanner Function
  const handleScanStart = () => {
    const html5QrCodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    html5QrCodeScanner.render(
      (decodedText) => {
        const parsedData = JSON.parse(decodedText); // Parse scanned JSON
        setScannedData(parsedData);
        html5QrCodeScanner.clear();
      },
      (error) => {
        console.error("Scan failed:", error);
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">QR Code Manager</h1>
      
      {/* Form for User Input */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Enter Your Details</h2>
        <input type="text" placeholder="Student Name" className="border p-2 w-full mb-2" onChange={(e) => setStudentName(e.target.value)} />
        <input type="text" placeholder="Purpose of Visit" className="border p-2 w-full mb-2" onChange={(e) => setPurpose(e.target.value)} />
        <input type="text" placeholder="Approved Time Slot (e.g. 10:00 AM - 11:00 AM)" className="border p-2 w-full mb-2" onChange={(e) => setTimeSlot(e.target.value)} />
        <input type="text" placeholder="Additional Comments" className="border p-2 w-full mb-2" onChange={(e) => setComments(e.target.value)} />
        <button onClick={handleGenerateQR} className="bg-green-500 text-white py-2 px-4 rounded">Generate QR Code</button>
        </div>
        
        {/* QR Code Generator */}
        {qrData && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Generated QR Code</h2>
            <QRCodeCanvas value={JSON.stringify(qrData)} size={256} level="H" includeMargin={true} />
            <p className="mt-2"> QR Data: <code>{JSON.stringify(qrData)}</code></p>
            </div>
        )} 
      
      {/* QR Code Scanner */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Scan QR Code</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          onClick={handleScanStart}>Start Scanning</button>
        <div id="reader" className="border p-4"></div>
      </div>
      
      {/* Scanned Data Display */}
      {scannedData && (
        <div className="p-4 border rounded shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Virtual Student Card</h3>
          <p><strong>Student Name:</strong> {scannedData.studentName}</p>
          <p><strong>Purpose:</strong> {scannedData.purpose}</p>
          <p><strong>Time Slot:</strong> {scannedData.timeSlot}</p>
          <p><strong>Comments:</strong> {scannedData.comments}</p>
          <p>

            <strong>Status: </strong>
            {isValidTimeSlot(scannedData.timeSlot)
              ? " ✅ Valid QR Code for this time slot"
              : " ❌ Invalid QR Code (outside approved time slot)"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeManager;
