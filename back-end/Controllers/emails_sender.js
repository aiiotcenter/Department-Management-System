// ===================================================================================
//? import the needed dependienceies
// ===================================================================================

const nodemailer = require('nodemailer');
require('dotenv').config();

const database = require('../Database_connection');

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
    tls: { // tls stand for Transport Layer Secure with is 587 port 
        rejectUnauthorized: false // we use it to prevents some TLS-related issues
    }
});


// this function get the details of sending the email and use the transporter
async function send_emails(receiver, subject, message) {
    const email_details = {
        from: process.env.Sender_Email,
        to: receiver, 
        subject: subject,
        text: message
    };

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


// ===================================================================================
module.exports = fetch_admins_and_send_emails;
