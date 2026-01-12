# Troubleshooting Guide

## If Something Still Doesn't Work:

### Error: "Cannot POST /api/auth/signup"
**Solution:** 
- Make sure backend is running (`node index.js` in backend folder)
- Check that Auth routes are properly imported in backend/index.js
- Verify CORS is enabled

### Error: "MongoDB connection error"
**Solution:**
- Check .env file has MONGO_CONN variable
- Verify MongoDB connection string is correct
- Make sure you have internet connection (MongoDB is cloud)
- Check MongoDB credentials: gig-user / BMRZEwNoQk5sWqHs

### Error: "JWT_SECRET is not defined"
**Solution:**
- Open .env file in backend folder
- Add: `JWT_SECRET=your_jwt_secret_key_12345`
- Save file
- Restart backend server

### Error: "User already exists"
**Solution:**
- Use a different email address
- Or delete the user from MongoDB manually using MongoDB Compass

### Error: "Invalid password"
**Solution:**
- Make sure you're using the correct password
- Password is case-sensitive
- Check for extra spaces in password

### Toast notifications not showing
**Solution:**
- Make sure react-toastify is installed: `npm install react-toastify`
- Check browser console for errors
- Make sure ToastContainer component is present in the JSX

### API call returns 500 error
**Solution:**
- Check backend terminal for error messages
- Look for password hashing errors
- Check database connection
- Restart backend server

### Token not being stored in localStorage
**Solution:**
- Check browser DevTools → Application → Local Storage
- Make sure success response has `success: true`
- Check console for errors in signup/login response handler

---

## Debug Commands:

### Check if backend is running:
```powershell
Test-NetConnection localhost -Port 5000
```

### View backend logs:
```powershell
# Terminal will show logs if running in foreground
# Check for errors about MongoDB or JWT
```

### Check MongoDB connection:
```powershell
# MongoDB is cloud-based, so you can only verify via:
# 1. Backend logs (shows "MongoDB Connected")
# 2. MongoDB Compass app (if you have it installed)
```

### Check if frontend dependencies are installed:
```powershell
cd C:\Users\Rushi\OneDrive\Desktop\gigflow\frontend
npm ls
```

### Clear node_modules and reinstall:
```powershell
# Backend
cd C:\Users\Rushi\OneDrive\Desktop\gigflow\backend
rm node_modules -Recurse
rm package-lock.json
npm install

# Frontend  
cd C:\Users\Rushi\OneDrive\Desktop\gigflow\frontend
rm node_modules -Recurse
rm package-lock.json
npm install
```

---

## File Checklist:

Make sure these files exist and have content:

- [ ] `/backend/.env` - Contains MONGO_CONN and JWT_SECRET
- [ ] `/backend/index.js` - Express server setup
- [ ] `/backend/Models/dbConn.js` - MongoDB connection
- [ ] `/backend/Models/Users.js` - User schema
- [ ] `/backend/Controllers/AuthControllers.js` - Auth logic
- [ ] `/backend/Routers/Auth.js` - Auth routes
- [ ] `/backend/package.json` - Dependencies
- [ ] `/frontend/src/Landing/Auth/Signup.jsx` - Signup form
- [ ] `/frontend/src/Landing/Auth/Login.jsx` - Login form
- [ ] `/frontend/src/App.jsx` - Routes setup
- [ ] `/frontend/utils.js` - Toast helpers
- [ ] `/frontend/package.json` - Dependencies

---

## Quick Start (Copy-Paste):

### Terminal 1:
```powershell
cd C:\Users\Rushi\OneDrive\Desktop\gigflow\backend
node index.js
```

### Terminal 2:
```powershell
cd C:\Users\Rushi\OneDrive\Desktop\gigflow\frontend
npm run dev
```

Then open browser to http://localhost:5173 and test signup/login!

---

## Common Port Issues:

- **Port 5000 already in use?**
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

- **Port 5173 already in use?**
  ```powershell
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

---

## Getting Help:

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Look at the AUTH_FIX_COMPLETE.md file for overview
4. Check response data in network tab (F12 → Network)
5. Add console.log statements to debug
