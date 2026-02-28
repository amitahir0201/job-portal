# ⚡ Quick Reference: Dynamic Email Fix

## 🚨 The Bug That Was Fixed

```javascript
// ❌ BEFORE: Always sent to 010tempt@gmail.com
await emailjs.send(
  serviceId,
  templateId,
  { name, reset_url },  // Missing: to_email!
  publicKey
);
```

```javascript
// ✅ AFTER: Sends to actual user email
await sendResetPasswordEmail(
  email,      // User's actual email
  name,       // User's name
  resetUrl    // Reset link
);
```

---

## 📋 Setup Checklist

### 1️⃣ EmailJS Dashboard - FIX Template

Go to: https://dashboard.emailjs.com/admin/templates

**Find your template** and click Edit

**Change "To Email" field:**
```
{{to_email}}
```

✅ **SAVE CHANGES**

### 2️⃣ Frontend .env

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=public_key_here
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Backend .env

```env
FRONTEND_URL=https://jobhubnow.vercel.app
```

---

## 🧪 Quick Test

### Test 1: Forgot Password
```
1. Go to YOUR_SITE/forgot-password
2. Enter: your_test_email@gmail.com
3. Check inbox
4. Email should arrive at your_test_email@gmail.com ✅
```

### Test 2: Reset Link Domain
```
1. Click reset link in email
2. URL should be: https://jobhubnow.vercel.app/reset-password/...
3. NOT: http://localhost:5173/... ✅
```

### Test 3: Admin Create Recruiter
```
1. As admin, create recruiter with recruiter_email@company.com
2. Check recruiter_email@company.com inbox
3. Email arrived ✅
4. Link is production domain ✅
```

---

## 🔍 Verify It's Working

### Check Console Logs
Open DevTools (F12) → Console tab

Look for messages like:
```
[EmailJS] Preparing to send password reset email {
  to_email: "user@example.com",
  user_name: "John Doe"
}

[EmailJS] Email sent successfully {
  status: 200,
  text: "OK",
  email: "user@example.com"
}
```

### Check EmailJS Dashboard
1. Go to https://dashboard.emailjs.com/
2. Click "Emails" tab
3. Look at recent emails
4. "To Email" column should show actual user emails
5. NOT 010tempt@gmail.com ✅

---

## 📁 Files Overview

```
frontend/src/
  ├── services/
  │   ├── emailService.js          ✨ NEW - Core EmailJS
  │   └── adminEmailService.js      ✨ NEW - Admin emails
  ├── components/
  │   └── AdminCreateRecruiter.jsx  ✨ NEW - Admin UI
  └── pages/
      └── ForgotPassword.jsx        🔄 UPDATED

Backend/
  ├── .env                          🔄 UPDATED
  └── src/controllers/
      └── adminController.js        🔄 UPDATED
```

---

## 🚨 If It's NOT Working

### Email goes to 010tempt@gmail.com
**Problem:** Template still has hardcoded email  
**Fix:** Edit template, change "To Email" to `{{to_email}}`

### Email has {{reset_link}} literally in it
**Problem:** Template parameter names don't match  
**Fix:** Ensure template uses: `{{to_email}}`, `{{user_name}}`, `{{reset_link}}`

### Reset link shows localhost
**Problem:** `FRONTEND_URL` in backend not set  
**Fix:** Set in `.env`: `FRONTEND_URL=https://jobhubnow.vercel.app`

### Email not arriving
**Check:**
1. Is `to_email` in template correct? ({{to_email}})
2. Are env vars set? (VITE_EMAILJS_*)
3. Check browser console for errors
4. Check EmailJS dashboard activity

---

## 📝 Code Examples

### Send Forgot Password Email

```javascript
// frontend/src/pages/ForgotPassword.jsx
import { sendResetPasswordEmail } from '../services/emailService';

const handleSubmit = async (e) => {
  // ... validation ...
  
  const response = await axios.post('/api/auth/forgot-password', { email });
  
  // ✅ Uses ACTUAL user email from form
  const result = await sendResetPasswordEmail(
    email,                    // User's email
    response.data.name,       // User's name
    response.data.resetUrl    // Link from backend
  );
  
  if (result.success) {
    alert('Email sent!');
  }
};
```

### Admin Create Recruiter

```javascript
// frontend/src/components/AdminCreateRecruiter.jsx
import { sendRecruiterInvitation } from '../services/adminEmailService';

const handleCreateRecruiter = async (recruiterData) => {
  const response = await axios.post('/api/admin/create-recruiter', recruiterData);
  
  // ✅ response.emailData contains to_email, user_name, reset_link
  const result = await sendRecruiterInvitation(response.data.emailData);
  
  if (result.success) {
    alert('Recruiter created and invited!');
  }
};
```

---

## 🎯 Key Points

| What | Before | After |
|------|--------|-------|
| Recipient | 010tempt@gmail.com (hardcoded) | `{{to_email}}` (dynamic) |
| Email service | Directly in component | Centralized service |
| Template params | Missing to_email | ✅ Has to_email, user_name, reset_link |
| Reset link | localhost:5173 | https://jobhubnow.vercel.app |
| Admin emails | Via backend mailer | Via frontend EmailJS |
| Error tracking | Basic | Console logs with [prefixes] |

---

## 📞 Support

**Issue:** Something not working?

1. Check `EMAILJS_SETUP_GUIDE.md` for detailed instructions
2. Check browser console for `[EmailJS]`, `[ForgotPassword]` logs
3. Verify template "To Email" field is `{{to_email}}`
4. Verify env variables are set correctly
5. Check EmailJS dashboard for send status

---

## ✅ Production Ready

Once you've done checklist above:
- ✅ Forgot password works with dynamic emails
- ✅ Admin recruiter creation works with invites
- ✅ Reset links point to production domain
- ✅ No more hardcoded 010tempt@gmail.com
- ✅ Ready to deploy! 🚀

---

Last updated: February 28, 2026
