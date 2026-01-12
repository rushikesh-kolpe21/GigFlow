const Users = require('../Models/Users');

//bcrypt and jwt imports for password hashing and token generation
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
const signup = async ( req, res ) => {
    try {
        
        const {firstName, lastName, email, password} = req.body;

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

