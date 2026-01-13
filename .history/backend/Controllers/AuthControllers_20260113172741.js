const Users = require('../Models/Users');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
const signup = async ( req, res ) => {
    try {
        
        const {firstName, lastName, email, password} = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // check if user already exists
        const existingUser = await Users.findOne({email});
        if(existingUser){
            return res.status(400)
            .json({
                message: "User already exists",
                success:false,
            })
        }

        
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

         // create new user 
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })
        await newUser.save();
 // create JWT token BEFORE sending response
        const token = jwt.sign(
            {userId: newUser._id, email: newUser.email}, // payload
            process.env.JWT_SECRET, // secret key
            {expiresIn: '1h'} // options
        );

        // Set cookies (same as login)
        res.cookie('token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',    
            maxAge: 3600000      
        });
        
        res.cookie('userInfo', JSON.stringify({
            id: newUser._id,
            name: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
        }), {
            httpOnly: false,     
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(201)
        .json({
            message: "User registered successfully",
            success:true,
            token,
            user: {
                id: newUser._id,
                name: `${newUser.firstName} ${newUser.lastName}`,
                email: newUser.email,
            }
        })
    }
    catch (error) {
         res.status(500)
        .json({
           message: "internal server erorr",
            success:false,
            error: error.message,
        });
    }
}

// LOGIN CONTROLLER

const login = async ( req, res ) => {
    try {
        const {email, password} = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }
        
        // check if user exists
        const userExists = await Users.findOne({email});  
        if(!userExists){
            return res.status(400).json({
                message: "User does not exist",
                success: false
            });
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid password",
                success: false
            });
        }   
        // create JWT token
        const token = jwt.sign(
            {userId: userExists._id, useremail: userExists.email}, // payload
            process.env.JWT_SECRET, // secret key
            {expiresIn: '1h'} // options
        );  

        // Set cookies
        res.cookie('token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',    
            maxAge: 3600000      
        });
        
        res.cookie('userInfo', JSON.stringify({
            id: userExists._id,
            name: `${userExists.firstName} ${userExists.lastName}`,
            email: userExists.email,
        }), {
            httpOnly: false,     
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });


        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: userExists._id,
                name: `${userExists.firstName} ${userExists.lastName}`,
                email: userExists.email,
            }
        }); 






    } catch (error) {
        console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
      });
    }
}


// LOGOUT CONTROLLER
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('userInfo');
        res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};const handleloginForm = async (event) => {
    event.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
        return handleError("Email and password are required");
    }

    try {
        const response = await axios.post(
            "http://localhost:5000/api/auth/login", 
            loginInfo,
            { withCredentials: true } // Enable cookies
        );
        const result = response.data;

        if (result.success) {
            handleSuccess(result.message);
            // Cookies are automatically stored by the browser
            setIsAuthenticated(true);
            setTimeout(() => navigate("/"), 1000);
        } else {
            handleError(result.message);
        }
    } catch (error) {
        handleError(error.message);
    }
};

module.exports = {
    signup,
    login,
    logout,
};