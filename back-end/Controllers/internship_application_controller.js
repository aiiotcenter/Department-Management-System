//===========================================================================================================
//? Import the database connection
//===========================================================================================================

const database = require('../Database_connection');

const fetch_admins_and_send_emails = require('./emails_sender');
//================================================================================================================================================================
//? GET, function to review waiting internship applications
//================================================================================================================================================================

const view_internship_applications = async (req, res) =>{
    try{
        const [applications] = await database.query(
            'SELECT * FROM internship_applications WHERE status = ?', ["waiting"])
        
        if(applications.length == 0){
            return res.json({ message: 'No waiting internship applications exists' });
        } 
        return res.json(applications)

    } catch (error) {
        console.log('Database Error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }

};

//================================================================================================================================================================
//? POST, function to create internship applications
//================================================================================================================================================================
 

const create_internship_application = async (req, res) => {
    const {department , period_of_internship, additional_notes} = req.body;

    try{
        // check if any required data is missing 
        if ( !department || !period_of_internship ){
            return res.status(400).json({message: 'Required data is Missing, Fill all information please'});
        };

        const notes = additional_notes || "";

        // logic to restrict the student from appling two internship at the same time
        // if student number exist in database then don't allow him to continue appling for second internship a the same time
        const[check_previous_application] = await database.query(
            'SELECT User_ID FROM internship_applications WHERE User_id = ? ', [req.user.id]);

        if(check_previous_application.length !== 0){
            console.log("Sorry, you can't apply for two internship at the same time!");
            return res.status(403).json({message :"Sorry, you can't apply for two internship at the same time!"});
        };
        
        // if he is not in database , then add him
        await database.query(
            'INSERT INTO internship_applications (User_name, User_ID, department, period_of_internship, status, additional_notes)  VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.name, req.user.id, department, period_of_internship, "waiting", notes]
        );

        console.log('Internship application was received from : ', req.user.name);

        //-------------------------------------------------------------------------------------------------------------
        // send email to the admins notifiying then with the new submission
        try{
            fetch_admins_and_send_emails("Internship Application", req.user.name);

            console.log('Internship submitted and admins was notified');
            return res.json({message: 'Internship submitted and admins was notified'});


        } catch(error){
            console.log("Something went wrong while sending emails to the admins: ", error);
            return res.json({message: `Something went wrong while sending emails to the admins: ${error}`});
        }

        //-------------------------------------------------------------------------------------------------------------
    } catch(error){
            console.log('Database Error:', error);
            return res.json({ message: 'Database error', error: error.message });
        };

};


//================================================================================================================================================================
//? PATCH, function to update the status of internship application
//================================================================================================================================================================
 
const update_internship_application = async (req, res) =>{
    const {student_id, status} = req.body;

    if ( !student_id || !status){
        return res.status(400).json({message: 'Required data is Missing, Fill all information please'});
    };
 
    //check if the internship application already exists in the database or it does not exists ------------------------
    const [check_existence] = await database.query(
        'SELECT * FROM internship_applications WHERE User_ID = ?',
        [student_id]
    );

    if (check_existence[0] == undefined){
        console.log(`Sorry! no internship applications found with this student id : ${student_id}`);
        return res.status(404).json({message: `Sorry! no internship applications found with this student id : ${student_id}`})
    };
    //--------------------------------------------------------------------------------------------------------

    try{
        await database.query('UPDATE internship_applications SET status = ? WHERE User_ID = ?', [status, student_id]);

        console.log("The Internship application status was updated" );
        return res.status(202).json({message:"The Internship application status was updated "});

    }catch(error) {
            console.log('Database Error:', error);
            return res.status(500).json({ message: 'Database error', error: error.message });
        };

};
//================================================================================================================================================================
module.exports.create_internship_application = create_internship_application;
module.exports.view_internship_applications = view_internship_applications;
module.exports.update_internship_application = update_internship_application;