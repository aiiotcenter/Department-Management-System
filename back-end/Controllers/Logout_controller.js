
const Logout_logic = async (req, res) => {
    try {
        res.clearCookie('token');
        const id = req.user.id;

        console.log(`User with this id : "${id}" logged out\n`); // test, can delete later
        return res.json({ message: `User logged out (${id})` });

    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

//===========================================================================================================
module.exports = Logout_logic;
