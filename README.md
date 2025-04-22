# Department Management System 

It’s web application that organize the operation within a department

### Tools used:
Back-end : Node.js , Express.js
Database: MySQL



### Features
This web application serve both students and administrative staff, with the following features:

**Student features:**
- schedule appointments
- submit entry request
- apply for internship application

**Employee features:**
- Review all waiting entry requests and internship applications
- Each employee can view only their own waiting appointment
- Update the status of waiting entry requests and internship applications
- Each employee can only update the status of their own waiting appointment
- A QR code will be generated and stored if an admin accept an application or an entry request

**Admin features:**
- Add and Remove Employees
- Manage employees details(such as photos, names and accounts

**Notifications features:**
- All employees will be notified when a student submit Entry request or Internship application
- Only the employee that the student wants to meet is notified in appointment case
- Students will be notified when an employee update the status of their appointment and request, and if the          
    status was Approved then the generated QR code will be sent in the email message
- Students will be notified when an employee updated the status of their internship application





### Project set up:
For the back-end section:

1-	clone the repository 

2-	Navigate to “back-end” folder

3-	Open the terminal 

4-	Write “node server.js” to start the server
