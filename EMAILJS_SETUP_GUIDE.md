# EmailJS Setup Guide for Dynamic Password Reset Emails

## Overview
This guide explains how to configure EmailJS to send password reset emails **dynamically to users' actual email addresses** (not hardcoded).

## Problem Fixed
**Before:** Emails were hardcoded to send to `010tempt@gmail.com`  
**Now:** Emails dynamically send to the actual user's email address using template parameters

---

## 1. EmailJS Template Configuration

### Step 1: Update Your EmailJS Template

Go to your EmailJS Dashboard and edit your email template:

**In the "To Email" field:**
```
{{to_email}}
```

❌ **DO NOT USE** a fixed email like: `010tempt@gmail.com`  
✅ **USE VARIABLE** like: `{{to_email}}`

### Step 2: Update Template Content

Add these placeholders to your email template HTML/text:

**Subject:**
```
Password Reset - {{user_name}}
```

**Email Body (HTML):**
```html
<h1>Hello {{user_name}},</h1>
<p>We received a request to reset your password.</p>
<p>Click the link below to set a new password (valid for 15 minutes):</p>
<a href="{{reset_link}}">Reset Password</a>
<p>Or copy and paste: {{reset_link}}</p>
```

---

## 2. Frontend Environment Variables

Add to your `.env.local` or `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Using the Email Services

### For Forgot Password Flow

**File:** `src/pages/ForgotPassword.jsx`

The component automatically:
1. Collects user's email
2. Calls backend to generate reset token
3. Sends email **TO THE USER'S EMAIL** via EmailJS
4. User receives password reset link

```javascript
import { sendResetPasswordEmail } from '../services/emailService';

// Inside handleSubmit:
const emailResult = await sendResetPasswordEmail(
  email,           // ✅ Dynamic: user's email
  userName,        // ✅ Dynamic: user's name
  resetUrl         // ✅ Reset link from backend
);
```

### For Admin Creating Recruiter

**File:** `src/components/AdminCreateRecruiter.jsx` (create this)

```javascript
import { sendRecruiterInvitation } from '../services/adminEmailService';

const handleCreateRecruiter = async (recruiterData) => {
  try {
    // 1. Create recruiter account (calls backend)
    const response = await axios.post(
      '/api/admin/create-recruiter',
      recruiterData
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // 2. Send invitation email via EmailJS
    const emailResult = await sendRecruiterInvitation(
      response.data.emailData  // Contains to_email, user_name, reset_link
    );

    if (emailResult.success) {
      alert('Recruiter created and invitation sent!');
    } else {
      alert('Recruiter created but email failed. Resend manually.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 4. Backend Configuration

**File:** `Backend/.env`

```env
FRONTEND_URL=https://jobhubnow.vercel.app
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_uri
```

The backend:
- Generates secure reset tokens
- Saves hashed tokens with timestamp expiry
- Returns `{ name, resetUrl, success }`
- Frontend handles email sending via EmailJS

---

## 5. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   FORGOT PASSWORD FLOW                       │
└─────────────────────────────────────────────────────────────┘

User fills form with email
         ↓
Frontend calls: POST /api/auth/forgot-password
         ↓
Backend generates token, saves hashed version
Returns: { success: true, name: "John", resetUrl: "..." }
         ↓
Frontend calls EmailJS with:
{
  to_email: "john@example.com",  ← User's email (dynamic!)
  user_name: "John",
  reset_link: "https://jobhubnow.vercel.app/reset-password/..."
}
         ↓
EmailJS sends email to john@example.com with reset link
         ↓
User clicks link in email and resets password

┌─────────────────────────────────────────────────────────────┐
│               ADMIN CREATE RECRUITER FLOW                    │
└─────────────────────────────────────────────────────────────┘

Admin fills recruiter form
         ↓
Frontend calls: POST /api/admin/create-recruiter
         ↓
Backend creates recruiter, generates token
Returns: {
  success: true,
  recruiter: {...},
  emailData: {
    to_email: "recruiter@company.com",
    user_name: "Jane Recruiter",
    reset_link: "https://jobhubnow.vercel.app/reset-password/..."
  }
}
         ↓
Frontend calls EmailJS with emailData
         ↓
EmailJS sends invite to recruiter@company.com
         ↓
Recruiter clicks link and sets password
```

---

## 6. Key Files Changed

| File | Change |
|------|--------|
| `src/services/emailService.js` | New: EmailJS utility with dynamic parameters |
| `src/services/adminEmailService.js` | New: Admin-specific email utilities |
| `src/pages/ForgotPassword.jsx` | Updated: Uses new email service with dynamic recipients |
| `Backend/src/controllers/authController.js` | Returns resetUrl for frontend to use |
| `Backend/src/controllers/adminController.js` | Returns emailData for frontend to use |
| `Backend/.env` | Updated: FRONTEND_URL to production domain |

---

## 7. Testing

### Test Forgot Password:
1. Go to `/forgot-password`
2. Enter your email address
3. Check email inbox (check spam folder too)
4. Email should arrive at YOUR email (not 010tempt@gmail.com)
5. Click link to reset password

### Test Admin Create Recruiter:
1. Log in as admin
2. Create new recruiter with email `test@example.com`
3. Recruiter should receive email at `test@example.com`
4. Recruiter clicks link and sets password

---

## 8. Troubleshooting

### Email always goes to 010tempt@gmail.com
**Solution:** Check EmailJS template's "To Email" field - it should be `{{to_email}}`, not a fixed email

### Email not arriving
**Check:**
1. EmailJS template is published
2. VITE_EMAILJS_* env vars are set correctly
3. Browser console for errors
4. EmailJS dashboard activity log

### Reset link is localhost
**Solution:** Update `Backend/.env` → `FRONTEND_URL=https://jobhubnow.vercel.app`

### Template variables not showing
**Solution:** Template parameters must match exactly:
- `{{to_email}}` ← to_email parameter
- `{{user_name}}` ← user_name parameter  
- `{{reset_link}}` ← reset_link parameter

---

## 9. Security Best Practices

✅ Token is hashed before saving to database  
✅ Token expires after 15 minutes (forgot password) or 24 hours (recruiter invite)  
✅ Token is never exposed in frontend code  
✅ Email addresses are normalized and validated  
✅ System never reveals if email exists (privacy)  

---

## 10. Production Checklist

- [ ] EmailJS credentials in `.env.local`
- [ ] `FRONTEND_URL` set to production domain
- [ ] EmailJS template uses `{{to_email}}` (not hardcoded email)
- [ ] Template variables match: `to_email`, `user_name`, `reset_link`
- [ ] Backend deployed with updated `.env`
- [ ] Frontend deployed with updated components
- [ ] Test forgot password flow end-to-end
- [ ] Test admin recruiter creation end-to-end

---

## Questions?

Check console logs with `[EmailJS]`, `[ForgotPassword]`, or `[AdminEmail]` prefixes for debugging information.
