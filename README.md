# Department Management System 

It’s web application that organize the operation within a department

### Tools used:
Back-end : Node.js , Express.js
Database: MySQL



### Features
This web application serve both students and administrative staff, with the following features:
**Student features:**
-	Students can schedule appointments with their teachers .
-	Students can submit entry request for restricted areas around the campus .
-	Student can apply for internship application.
  
**Admins features:**
-	Review all waiting entry requests and internship applications.
-	Each teacher can view only their own waiting appointment.
-	Update the status of waiting entry requests and internship applications.
-	Each teacher can only update the status of their own waiting appointment.
-	A QR code will be generated and stored if  an admin accept an application or an entry request.
  
**Notifications features:**
-	All admins will be notified when a student submit Entry request or Internship application.
-	Only the teacher that the student wants to meet is notified in appointment case.
-	Students will be notified when an admin update the status of their appointment and request, and if the status was Approved then the generated QR code will be sent in the email message.
-	students will be notified when an admin updated the status of their internship application.
  
**Authentication feature:**
-	Users can register, log in and log out of the system.



### Project set up:
For the back-end section:

1-	clone the repository 

2-	Navigate to “back-end” folder

3-	Open the terminal 

4-	Write “node server.js” to start the server
