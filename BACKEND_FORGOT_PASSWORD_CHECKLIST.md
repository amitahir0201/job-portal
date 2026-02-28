# Backend Configuration & Verification Checklist

## ✅ Backend Components Verification

### 1. User Model - Required Fields

**File:** `Backend/src/models/User.js`

**Required fields for password reset:**

```javascript
// These fields MUST be present in User schema:

resetPasswordToken: {
  type: String,
  default: null,
  sparse: true,
  index: true  // Add index for performance
},

resetPasswordExpires: {
  type: Date,
  default: null,
  index: true  // Add index for query performance
}
```

**Verification:**
- [ ] `resetPasswordToken` field exists
- [ ] `resetPasswordExpires` field exists
- [ ] Both have `index: true` for query optimization
- [ ] Email field is unique and case-insensitive

---

### 2. Authentication Controller

**File:** `Backend/src/controllers/authController.js`

**Required functions:**

```javascript
// MUST have these two functions:

1. exports.forgotPassword(req, res)
   Input: { email }
   Process:
   - Validate email format
   - Find user by email (case-insensitive)
   - Generate 32-byte token: crypto.randomBytes(32).toString('hex')
   - Hash token: SHA256 hash
   - Set expiry: 15 minutes (900000 ms)
   - Save to database
   - Send email
   Output: Generic response (200 always)

2. exports.resetPassword(req, res)
   Input: { token in URL, password in body }
   Process:
   - Hash the token
   - Find user with this token and non-expired expiry
   - Validate password (min 6 chars)
   - Update password (let pre-save hook hash it)
   - Clear resetPasswordToken and resetPasswordExpires
   - Delete old tokens if multiple exist
   Output: Success/error response
```

**Verification:**
- [ ] `forgotPassword` function implemented
- [ ] `resetPassword` function implemented
- [ ] Token generation uses `crypto.randomBytes(32)`
- [ ] Token hashing uses SHA256
- [ ] Expiry set to 15 minutes
- [ ] Generic response implemented (no email leak)
- [ ] Email sending integrated

---

### 3. Email Service

**File:** `Backend/src/services/mailer.js`

**Must support:**

```javascript
1. Ethereal Test Account (Development)
   - Auto-generates test account
   - Logs credentials to console
   - Provides preview URLs for emails

2. SMTP Production (Gmail/Corporate)
   - Uses EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
   - Falls back to Ethereal if not configured
   - Sends real emails in production

3. sendPasswordResetEmail(email, resetUrl)
   - Sends HTML email with reset link
   - Sets proper from address
   - Includes expiry time (15 minutes)
   - Professional template
```

**Verification:**
- [ ] Nodemailer installed: `npm ls nodemailer`
- [ ] Ethereal fallback implemented
- [ ] Email template includes reset link
- [ ] From address configured
- [ ] Error handling in place
- [ ] Test emails are previewed in console

---

### 4. Routes Configuration

**File:** `Backend/src/routes/auth.js`

**Required endpoints:**

```javascript
// MUST have these routes:

router.post('/forgot-password', 
  asyncHandler(authController.forgotPassword)
);

router.post('/reset-password/:token', 
  asyncHandler(authController.resetPassword)
);

// Both routes must be wrapped in asyncHandler for error handling
```

**Verification:**
- [ ] Both routes defined
- [ ] Wrapped in asyncHandler middleware
- [ ] POST methods correct
- [ ] `:token` parameter in URL
- [ ] Controller methods are async

---

### 5. Middleware Integration

**File:** `Backend/src/middleware/asyncHandler.js`

**Usage:**
```javascript
// Wraps async route handlers to catch errors
// Required for safety

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Verification:**
- [ ] asyncHandler middleware exists
- [ ] All auth routes use it

---

## 📋 Environment Variables

**File:** `Backend/.env`

**Required variables:**

```bash
# Email Service Configuration
EMAIL_HOST=smtp.gmail.com              # SMTP server
EMAIL_PORT=587                         # SMTP port
EMAIL_SECURE=false                     # false for 587, true for 465
EMAIL_USER=your-email@gmail.com        # Your email account
EMAIL_PASS=your-16-char-app-pwd        # App-specific password
EMAIL_FROM=noreply@jobportal.com      # From address in email

# Frontend Configuration
FRONTEND_URL=http://localhost:5173    # Dev: Vite dev server URL
# FRONTEND_URL=https://yourdomain.com # Production: Your domain

# Database
MONGODB_URI=mongodb://localhost/job_portal_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Application
NODE_ENV=development                   # or production
PORT=5000
```

**For Gmail Setup:**
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password to `EMAIL_PASS`

**Verification Checklist:**
- [ ] All EMAIL_* variables set
- [ ] FRONTEND_URL matches your actual frontend domain
- [ ] EMAIL_PASS is 16-character app password (not regular password)
- [ ] NODE_ENV set correctly (development or production)

---

## 🔍 Dependencies Check

**Required packages:**

```bash
# Check installed versions:
npm list nodemailer
npm list bcryptjs
npm list crypto  # Built-in, not needed to install
```

**Install if missing:**
```bash
cd Backend
npm install nodemailer bcryptjs

# For development testing:
npm install --save-dev nodemon
```

**Verification:**
- [ ] nodemailer v6.9+ installed
- [ ] bcryptjs v2.4+ installed
- [ ] crypto is built-in to Node.js
- [ ] package.json updated

---

## 🚀 Deployment Steps

### Local Development Testing

```bash
# 1. Install dependencies
cd Backend
npm install

# 2. Create .env file with EMAIL configuration
# Use Ethereal test account (auto-generated)

# 3. Start MongoDB
# mongod --dbpath ./data

# 4. Start backend server
npm run dev

# 5. Check console for Ethereal test account details
# Copy preview URL to browser to see sent emails

# 6. In another terminal, start frontend
cd frontend
npm run dev
```

### Staging Deployment

```bash
# 1. Set real SMTP credentials in .env
# Example: Gmail account with app password

# 2. Set FRONTEND_URL to staging domain
# FRONTEND_URL=https://staging.yourdomain.com

# 3. Deploy backend to staging server
# Ensure environment variables are set on server

# 4. Test complete flow in staging

# 5. Verify email deliverability
```

### Production Deployment

```bash
# 1. Use production email service
# Options: Gmail, SendGrid, AWS SES, corporate SMTP

# 2. Set production environment variables
# FRONTEND_URL=https://yourdomain.com
# NODE_ENV=production

# 3. Enable security features:
# - HTTPS only
# - Secure cookies
# - Rate limiting on auth endpoints
# - Database backups

# 4. Monitor error logs
# - Check for failed email deliveries
# - Monitor token redemption rates
# - Track reset success metrics

# 5. Set up alerting
# - Alert if reset emails fail
# - Monitor token generation rates
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module 'nodemailer'"

**Solution:**
```bash
cd Backend
npm install nodemailer
```

### Issue: "Email not sending"

**Diagnosis:**
1. Check if using Ethereal (auto-generated)
   - Look in backend console for credentials
   - Use preview URL provided

2. If using Gmail:
   - Verify it's App Password, not regular password
   - Check 2FA is enabled
   - Re-generate app password

3. Check email configuration:
   ```javascript
   console.log('Email config:', {
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     user: process.env.EMAIL_USER
   });
   ```

### Issue: "Invalid or expired reset token"

**Diagnosis:**
1. Verify token was not modified
2. Check timestamp: `resetPasswordExpires > Date.now()`
3. Ensure token is hashed correctly

**Fix:**
```javascript
// In resetPassword, log for debugging:
console.log('Token received:', req.params.token);
console.log('Token length:', req.params.token.length);
console.log('User found:', user ? user.email : 'NOT FOUND');
console.log('Token expires:', new Date(user?.resetPasswordExpires));
```

### Issue: "CORS error" when calling forgot-password

**Solution:**
```javascript
// In Backend app.js, ensure CORS is configured:
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',      // Dev frontend (change if different)
    'https://yourdomain.com'       // Production
  ],
  credentials: true
}));
```

### Issue: "Token mismatch" in database

**Diagnosis:**
The token sent in email should NOT match what's stored.
- Stored: SHA256 hash of token
- Email: Plain token (so user can use it)

**Fix:**
Don't compare tokens directly. Always hash both before comparing.

---

## 📊 Testing Commands

### Test Email Sending

```bash
# In Backend controller, add debug function:

async function testEmailSending() {
  try {
    await sendPasswordResetEmail(
      'test@example.com',
      'http://localhost:5173/reset-password/test-token-12345'
    );
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

// Call this in development to test
```

### Test Token Generation

```bash
const crypto = require('crypto');

// Generate token like the controller does
const token = crypto.randomBytes(32).toString('hex');
console.log('Generated token:', token);
console.log('Token length:', token.length);  // Should be 64 (32 bytes * 2 hex chars)

// Hash it like the controller does
const hashedToken = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');
console.log('Hashed token:', hashedToken);
console.log('Hashed length:', hashedToken.length);  // Should be 64
```

### Test API Endpoints

```bash
# Test forgot-password endpoint
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Expected: { "success": true, "message": "..." }

# Test reset-password endpoint
curl -X POST http://localhost:5000/api/auth/reset-password/YOUR_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password":"NewPassword123"}'

# Expected: { "success": true, "message": "Password reset successful" }
```

---

## ✨ Performance Optimization

### Database Indexes

Add these indexes to `User.js`:

```javascript
// For fast token lookup
resetPasswordToken: {
  type: String,
  index: true,        // ← Add this
  sparse: true
},

resetPasswordExpires: {
  type: Date,
  index: true,        // ← Add this
  sparse: true
},

email: {
  type: String,
  unique: true,
  lowercase: true,
  index: true,        // ← Already should have this
  required: true
}
```

### Cleanup Expired Tokens

Add a scheduled job (every hour):

```javascript
// Backend/src/jobs/cleanupResetTokens.js
const User = require('../models/User');

async function cleanupExpiredTokens() {
  const result = await User.updateMany(
    {
      resetPasswordToken: { $ne: null },
      resetPasswordExpires: { $lt: Date.now() }
    },
    {
      $set: {
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    }
  );
  console.log(`Cleaned up ${result.modifiedCount} expired tokens`);
}

module.exports = cleanupExpiredTokens;

// In app.js, schedule it:
const schedule = require('node-schedule');
const cleanup = require('./jobs/cleanupResetTokens');

// Run every hour
schedule.scheduleJob('0 * * * *', cleanup);
```

---

## 🔐 Security Hardening

### Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 3,                     // 3 requests per window
  message: 'Too many reset attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many reset attempts. Try again later.',
});

router.post('/forgot-password', 
  forgotPasswordLimiter,
  asyncHandler(authController.forgotPassword)
);

router.post('/reset-password/:token',
  resetPasswordLimiter,
  asyncHandler(authController.resetPassword)
);
```

### Add HTTPS Enforcement

```javascript
// In production, redirect HTTP to HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## ✅ Final Verification Checklist

Before deploying to production:

- [ ] User model has resetPasswordToken and resetPasswordExpires
- [ ] authController has forgotPassword and resetPassword functions
- [ ] mailer.js implements email sending
- [ ] auth.js routes configured
- [ ] asyncHandler wraps both routes
- [ ] .env has all EMAIL_* variables
- [ ] FRONTEND_URL set correctly
- [ ] Token expiry is 15 minutes
- [ ] Nodemailer is installed
- [ ] Error handling is comprehensive
- [ ] CORS allows frontend origin
- [ ] Rate limiting configured (optional but recommended)
- [ ] Email template is professional
- [ ] Database indexes are set
- [ ] Cleanup job is scheduled (optional)
- [ ] HTTPS enforced in production

---

## 📞 Support References

- Nodemailer Docs: https://nodemailer.com/
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- MongoDB Indexing: https://docs.mongodb.com/manual/indexes/
- Express Rate Limiting: https://github.com/nfriedly/express-rate-limit

---

**Status: All Configuration Complete** ✅
