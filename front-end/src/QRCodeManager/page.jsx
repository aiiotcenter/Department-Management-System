import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/QRCodeManager.css";

const QRCodeManager = () => {
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  // Fetch approved request from backend
  useEffect(() => {
    fetch("/api/approved-request") // Adjust API endpoint as needed
      .then((response) => response.json())
      .then((data) => setApprovedRequest(data))
      .catch((error) => console.error("Error fetching approved request:", error));
  }, []);

  // Function to check if the current time is within the approved time slot
  const isValidTimeSlot = (timeSlot) => {
    if (!timeSlot) return false;
    const currentTime = new Date();
    const [startTime, endTime] = timeSlot.split(" - ").map((time) => {
      const [hours, minutes, period] = time.split(/[:\s]/);
      let adjustedHours = parseInt(hours);
      if (period === "PM" && adjustedHours < 12) adjustedHours += 12;
      return new Date(currentTime.setHours(adjustedHours, minutes, 0, 0));
    });
    return currentTime >= startTime && currentTime <= endTime;
  };

  // Start QR code scanner
  const handleScanStart = () => {
    const html5QrCodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    html5QrCodeScanner.render(
      (decodedText) => {
        const parsedData = JSON.parse(decodedText);
        setScannedData(parsedData);
        html5QrCodeScanner.clear();
      },
      (error) => console.error("Scan failed:", error)
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">QR Code Manager</h1>

      {/* QR Code Generator */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Generate QR Code</h2>
        {approvedRequest ? (
          <>
            <QRCodeCanvas value={JSON.stringify(approvedRequest)} size={256} level="H" includeMargin={true} />
            <p className="mt-2">
              QR Data: <code>{JSON.stringify(approvedRequest)}</code>
            </p>
          </>
        ) : (
          <p>No approved request found.</p>
        )}
      </div>

      {/* QR Code Scanner */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Scan QR Code</h2>
        <button className="bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={handleScanStart}>
          Start Scanning
        </button>
        <div id="reader" className="border p-4"></div>
      </div>

      {/* Virtual Student Card */}
      {scannedData && (
        <div className="p-4 border rounded shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Virtual Student Card</h3>
          <p><strong>Student Name:</strong> {scannedData.studentName}</p>
          <p><strong>Purpose:</strong> {scannedData.purpose}</p>
          <p><strong>Approved Time Slot:</strong> {scannedData.timeSlot}</p>
          <p><strong>Comments:</strong> {scannedData.comments}</p>

          {/* Time Slot Validation */}
          <p>
            <strong>Status: </strong>
            {isValidTimeSlot(scannedData.timeSlot)
              ? "Valid QR Code for this time slot"
              : "Invalid QR Code (outside approved time slot)"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeManager;
