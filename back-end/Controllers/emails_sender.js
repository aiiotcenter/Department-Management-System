// ===================================================================================
//? import the needed dependienceies
// ===================================================================================

const nodemailer = require('nodemailer');
require('dotenv').config();

const database = require('../Database_connection');
const fs = require("fs"); // to read the file
const path = require("path");

// ===================================================================================
//?  create email transporter and the function that will send emails
// ===================================================================================

// here I'm creating the email transporter by using nodemailer, it will be used to send emails via SMTP server(Simple Mail Transfer Protocol)

const transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: process.env.Email_Port,
    secure: false, //we write false because we don't want to use SSL/TLS ,instead we want to use 587 port (STARTTLS)
    auth: {
        user: process.env.Sender_Email,
        pass: process.env.Email_App_Password
    },
    tls: { // tls stand for Transport Layer Secure with 587 port 
        rejectUnauthorized: false // we use it to prevents some TLS-related issues
    }
});


// this function get the details of sending the email and use the transporter
async function send_emails(receiver, subject, message, qr_code_path) {
    let email_details;

    // if it was internhip application we have no qr code 
    if (qr_code_path == undefined){            
        email_details = {
            from: process.env.Sender_Email,
            to: receiver, 
            subject: subject,
            text: message,
        }; 

    }else{ // in case of appointment or request we have qr code that we need to attache 
      // Read the QR code image file into a buffer
        const qrCodeBuffer = fs.readFileSync(String(qr_code_path));
            
        email_details = {
            from: process.env.Sender_Email,
            to: receiver, 
            subject: subject,
            text: message,
            attachments: [
                    {
                        filename: "QR_code.png",
                        content: qrCodeBuffer
                        
                    }
                ]
        };  
    }

    

    try {
        await transporter.sendMail(email_details);
        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error occured while sending email:', error);
    }
}


// ====================================================================================================================================
//? fetch all admin emails from the database and store them in array "admin_emails" then send them email about the new submission
// ====================================================================================================================================


async function fetch_admins_and_send_emails(submission, student_name, appointment_receiver) {

    let admin_emails;

    // if we don't have appovintment receiver (that means we are dealing with entery request or internship application)
    // we send email to all the admins
    if(!appointment_receiver){
        
        admin_emails = [];
        // fetch all admin emails
        const [fetch_admins] = await database.query(
            'SELECT Email_address FROM users WHERE User_Role = ?', ["admin"]
        );
        
        // take the emails from fetch_admins and store then in one array , so sending emails would be easier
        for(let i = 0; i < fetch_admins.length ; i++){
            email = fetch_admins[i].Email_address;
            admin_emails.push(email)
        };

    }else{// if we have value for appointment_receiver , then we are implementing appointment opeartion and we need to send the email only for the appointment approver 
        // let admin_emails store the value of appointment_receiver
        admin_emails = appointment_receiver;
    }
    
    console.log(admin_emails); // private test: to know who are the admins

    if(admin_emails.length > 0){
        await send_emails(
            admin_emails, 
            `New ${submission} was submitted`, // submission here is the new thing that was submitted (appointment, inernship application , entery request)
            `A new ${submission} was submitted by : ${student_name}`
        );
    }
    
}




// ====================================================================================================================================
//? Inform the student about the new status of the appointment/ request/ application
// ====================================================================================================================================

async function notify_student(submission, status, student_email, appointment_approver, qr_code) {

    if ( submission === "Entry Request") {

        if(status == "Approved"){
            await send_emails(
            student_email, 
            `Your ${submission} was Approved`,
            `The ${submission} you made earlier was Approved from the administrative staff and here's the QR code for your ${submission}:`,
            qr_code);  
        }else{
            await send_emails(
            student_email, 
            `Your ${submission} was Declined`,
            `The ${submission} you made earlier was Declined from the administrative staff`);  
        }
       
        
    }else if (submission === "Appointment"){

        if(status == "Approved"){
            await send_emails(
            student_email, 
            `Your ${submission} was Approved`,
            `The ${submission} you made earlier was Approved by ${appointment_approver} and here's the QR code for your ${submission}:`,
            qr_code);  
        }else{
            await send_emails(
            student_email, 
            `Your ${submission} was Declined`,
            `The ${submission} you made earlier was Declined by ${appointment_approver}`);  
        }
       

    }else{
        await send_emails(
            student_email, 
            `Your ${submission} was ${status}`, 
            `The ${submission} you made earlier was ${status} from the administrative staff`);
    }

}

// ===================================================================================
module.exports.fetch_admins_and_send_emails = fetch_admins_and_send_emails;
module.exports.notify_student = notify_student;
