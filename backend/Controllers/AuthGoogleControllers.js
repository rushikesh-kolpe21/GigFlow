const Users = require('../Models/Users');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { idToken, accessToken } = req.body;

    console.log("Google Login Request received");
    console.log("ID Token received:", !!idToken);
    console.log("Access Token received:", !!accessToken);
    console.log("Client ID:", GOOGLE_CLIENT_ID?.substring(0, 20) + "...");

    if (!idToken && !accessToken) {
      return res.status(400).json({
        success: false,
        message: "ID Token or Access Token missing"
      });
    }

    let payload;

    if (idToken) {
      //  Verify the ID token with Google
      console.log(" Verifying ID token with Google...");
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      console.log(" ID Token verified successfully");
      payload = ticket.getPayload();
    } else {
      // Use access token to fetch userinfo
      console.log(" Fetching userinfo with access token...");
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!userinfoRes.ok) {
        const errText = await userinfoRes.text();
        throw new Error(`Failed to fetch userinfo: ${userinfoRes.status} ${errText}`);
      }

      payload = await userinfoRes.json();
      console.log(" Userinfo fetched. Email:", payload.email);
    }

    const { name, email, picture, sub } = payload;
    console.log(" Token verified. Email:", email);
    
    const [firstName, ...lastNameArr] = name.split(' ');
    const lastName = lastNameArr.join(' ') || 'User';

    // 🔹 Find or create user
    let user = await Users.findOne({ email });

    if (!user) {
      console.log(" Creating new Google user...");
      // Hash the placeholder password
      const hashedPassword = await bcrypt.hash('google_oauth_user', 10);
      user = await Users.create({
        firstName,
        lastName,
        email,
        googleId: sub,
        password: hashedPassword,
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      console.log(" Linking Google account to existing user...");
      user.googleId = sub;
      await user.save();
    }

    // 🔹 Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(" JWT token created. User:", user._id);
    console.log(" About to set cookies for user:", user._id);

    // 🔹 Set cookies (same as local login)
    console.log(" Setting cookies for user:", user._id);
    
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
    console.log(" token cookie set");

    res.cookie('userInfo', JSON.stringify({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
    console.log(" userInfo cookie set");

    // 🔹 Return success with user data
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        googleId: user.googleId
      }
    });

  } catch (error) {
    console.error("❌ Google login error:", error.message);
    console.error("Full error:", error);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
      error: error.message
    });
  }
};

module.exports = { googleLogin };