
const Logout_logic = (req, res) => {

    res.clearCookie('token');
    const email = req.user.email;
    console.log(`User with this email address: "${email}" logged out\n`); // test i can delete it ( i added "protect" just for this test line, i can remove it)
    res.json({message: `User logged out (${email})`})
};

//===========================================================================================================
module.exports = Logout_logic;