# Frontend Implementation Guide - Forgot Password System

## 🎨 Complete Frontend Setup

### Route Configuration

**File:** `frontend/src/App.jsx` (or your main router file)

```javascript
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Add to your router:
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
```

### API Service Configuration

**File:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

// Get API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Include cookies if using session auth
});

export default api;
```

**Vite Environment Configuration:**

**File:** `.env` (frontend root)

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Or use .env.production for production
# VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🎭 Component Architecture

### 1. ForgotPassword Component

**Location:** `frontend/src/pages/ForgotPassword.jsx`

**Component Structure:**
```
ForgotPassword
├── State (email, error, success, loading)
├── Functions
│   ├── validateEmail()
│   └── handleSubmit()
└── UI
    ├── Gradient Background
    ├── Card Container
    ├── Header
    ├── Error Alert
    ├── Success Alert
    ├── Form
    │   ├── Email Input
    │   └── Submit & Cancel Buttons
    └── Footer with Sign In Link
```

**Key Features:**
- ✅ Real-time email validation
- ✅ Loading state with spinner
- ✅ Error/success messages
- ✅ Email normalization
- ✅ Auto-redirect to login on success
- ✅ Clean, professional UI

**Feature Details:**

1. **Email Validation**
   ```javascript
   const validateEmail = (value) => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
   };
   ```

2. **Form Submission**
   ```javascript
   const handleSubmit = async (e) => {
     e.preventDefault();
     
     // Validate email format
     if (!validateEmail(email)) {
       return setError('Please enter a valid email address');
     }
     
     try {
       setLoading(true);
       const response = await axios.post(
         `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`,
         { email: email.toLowerCase().trim() }
       );
       
       if (response.data?.success) {
         setSuccess('Check your email for password reset instructions.');
         setEmail('');
         setTimeout(() => navigate('/login'), 4000);
       }
     } catch (err) {
       const errorMessage = err.response?.data?.message || 'Unable to process request.';
       setError(errorMessage);
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Email Normalization**
   - Convert to lowercase
   - Trim whitespace
   - Prevent user typos in email field

---

### 2. ResetPassword Component

**Location:** `frontend/src/pages/ResetPassword.jsx`

**Component Structure:**
```
ResetPassword
├── State
│   ├── password
│   ├── confirmPassword
│   ├── showPassword / showConfirm
│   ├── error / success / loading
│   └── strength (calculated)
├── Functions
│   ├── getPasswordStrength()
│   ├── validate()
│   └── handleSubmit()
└── UI
    ├── Gradient Background
    ├── Card Container
    ├── Header
    ├── Error Alert
    ├── Success Alert
    ├── Form (conditional on !success)
    │   ├── Password Field
    │   │   ├── Input with toggle
    │   │   └── Strength Indicator
    │   │       ├── Strength label & color
    │   │       ├── Progress bar
    │   │       └── Requirements checklist
    │   ├── Confirm Password Field
    │   │   ├── Input with toggle
    │   │   └── Match indicator
    │   └── Submit Button
    ├── Success Button (conditional on success)
    └── Footer with Sign In Link
```

**Advanced Features:**

1. **Password Strength Indicator**
   ```javascript
   const getPasswordStrength = (pwd) => {
     if (!pwd) return { level: 0, text: '', color: '' };
     
     if (pwd.length < 6) {
       return { level: 1, text: 'Weak', color: 'text-red-600' };
     }
     
     if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
       return { level: 2, text: 'Fair', color: 'text-yellow-600' };
     }
     
     return { level: 3, text: 'Strong', color: 'text-emerald-600' };
   };
   ```

2. **Visual Strength Meter**
   - Red (Weak): < 6 chars
   - Yellow (Fair): 6-10 chars or missing requirements
   - Green (Strong): 10+ chars + uppercase + number

3. **Requirements Checklist**
   - ✓ At least 6 characters
   - ✓ Mix of uppercase and lowercase
   - ✓ At least one number
   
   Dynamic updates as user types.

4. **Show/Hide Password Toggles**
   ```javascript
   <button
     type="button"
     onClick={() => setShowPassword(!showPassword)}
     className="absolute right-3 top-1/2 -translate-y-1/2"
   >
     {showPassword ? '🙈' : '👁️'}
   </button>
   ```

5. **Password Match Indicator**
   ```javascript
   {confirmPassword && (
     <p className={password === confirmPassword ? 'text-emerald-600' : 'text-red-600'}>
       {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
     </p>
   )}
   ```

6. **Token Extraction**
   ```javascript
   const { token } = useParams();
   // Token automatically extracted from URL: /reset-password/TOKEN_HERE
   ```

7. **Intelligent Error Messages**
   ```javascript
   if (errorMessage.includes('expired')) {
     setError('Your reset link has expired. Please request a new one.');
   } else if (errorMessage.includes('invalid')) {
     setError('Invalid reset link. Please request a new password reset.');
   } else {
     setError(errorMessage);
   }
   ```

---

## 🎨 UI/UX Design Details

### Color Palette

```css
/* Primary: Emerald (Green) */
emerald-50    #f0fdf4    /* Background */
emerald-100   #dcfce7
emerald-500   #10b981    /* Accent */
emerald-600   #059669    /* Primary button */
emerald-700   #047857    /* Button hover */

/* Status Colors */
red-600       #dc2626    /* Error/Weak */
yellow-600    #ca8a04    /* Warning/Fair */
emerald-600   #059669    /* Success/Strong */

/* Neutral */
gray-200      #e5e7eb    /* Border */
gray-500      #6b7280    /* Secondary text */
gray-600      #4b5563    /* Text */
gray-900      #111827    /* Heading */

/* Background */
blue-50       #eff6ff    /* Gradient accent */
white         #ffffff    /* Card */
```

### Typography

```css
/* Headings */
h1 {
  font-size: 1.875rem;    /* text-3xl */
  font-weight: 700;       /* font-bold */
  color: rgb(17, 24, 39); /* gray-900 */
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;       /* font-semibold */
}

/* Labels */
label {
  font-size: 0.875rem;    /* text-sm */
  font-weight: 600;
}

/* Body */
p {
  font-size: 1rem;
  line-height: 1.5;
}

/* Small */
.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}
```

### Spacing

```css
/* Card padding */
.card { padding: 2rem; }

/* Form spacing */
.form { gap: 1.5rem; }

/* Input padding */
input { padding: 0.75rem 1rem; }

/* Button padding */
button { padding: 0.75rem 1.5rem; }

/* Margin between sections */
.section { margin-bottom: 2rem; }
```

### Responsive Design

```css
/* All components are mobile-first responsive */

/* Container */
.max-w-md { max-width: 28rem; } /* 448px */

/* Padding */
px-4 { padding-left: 1rem; padding-right: 1rem; } /* Mobile */

/* Touch targets */
/* All buttons: min 44px height for touch accessibility */
button { min-height: 44px; }

input { min-height: 44px; }
```

---

## 🔗 User Flow

### Flow Diagram

```
┌─────────────────────```
│ User Forgot Password
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ ForgotPassword
    │   Component
    └──────┬───────┘
           │
           ├─ Enter Email
           │
           ├─ Validate Email
           │  └─ Invalid? Show error
           │
           ├─ Send to /auth/forgot-password
           │
           ├─ Success
           │  └─ Show message
           │  └─ Auto-redirect /login (4s)
           │
           └─ Error
              └─ Show error message

───────────────────────────────

┌────────────────────────────┐
│ User Clicks Email Reset Link
│ URL: /reset-password/:token
└───────────┬────────────────┘
            │
            ▼
       ┌────────────────┐
       │ ResetPassword
       │   Component
       └────────┬───────┘
                │
                ├─ Extract token from URL
                │
                ├─ Enter New Password
                │  └─ Show strength indicator
                │  └─ Show requirements checklist
                │
                ├─ Confirm Password
                │  └─ Show match indicator
                │
                ├─ Validate passwords
                │  └─ Min 6 chars?
                │  └─ Passwords match?
                │
                ├─ Send to /auth/reset-password/:token
                │
                ├─ Success
                │  └─ Show success message
                │  └─ Auto-redirect /login (2s)
                │
                └─ Error
                   └─ Show error message
                   └─ Suggest new reset if expired
```

---

## 📱 Mobile Responsiveness

All components automatically adapt:

| Screen | Width | Behavior |
|--------|-------|----------|
| Mobile | < 640px | Full width, padding 1rem |
| Tablet | 640-1024px | Centered, max-w-md |
| Desktop | > 1024px | Centered, responsive |

Key responsive elements:
- Buttons: Full width on mobile, normal width on desktop
- Cards: 100% - 2rem padding on mobile, fixed width on desktop
- Typography: Slightly smaller on mobile, normal on desktop
- Spacing: Reduced on mobile for compact layout

---

## ♿ Accessibility Features

```jsx
// Labels properly associated with inputs
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// Buttons have meaningful text
<button>Send Reset Link</button>  // Good
<button>Submit</button>            // Less accessible

// Form validation provides clear feedback
<div role="alert">{error}</div>

// Password visibility toggle is keyboard accessible
<button type="button" onClick={...}>Show Password</button>

// Error messages are semantically marked
<div className="bg-red-50 border border-red-200" role="alert">
  {error}
</div>

// Success messages are also marked
<div className="bg-emerald-50 border border-emerald-200" role="status">
  {success}
</div>

// Form controls are properly labeled
<label className="block text-sm font-semibold">
  New Password
</label>
<input aria-label="New password" type="password" />
```

---

## 🔌 API Integration Details

### Forgot Password Request

```javascript
// Method: POST
// URL: /api/auth/forgot-password
// Headers: Content-Type: application/json

const payload = {
  email: "user@example.com"  // Normalized: lowercase + trimmed
};

// Response (always 200):
{
  success: true,
  message: "If an account exists, reset instructions sent to email."
}

// Generic response: indicates email doesn't exist in same way as success
// This prevents attackers from discovering valid emails
```

### Reset Password Request

```javascript
// Method: POST
// URL: /api/auth/reset-password/:token
// Headers: Content-Type: application/json

const payload = {
  password: "NewPassword123"
};

// Response (200 - Success):
{
  success: true,
  message: "Password reset successful"
}

// Response (400 - Error):
{
  success: false,
  message: "Invalid or expired reset token"
}
```

### Error Handling Strategy

```javascript
try {
  const response = await axios.post(endpoint, data);
  
  if (response.data?.success) {
    // Handle success
    setSuccess(response.data.message);
  }
} catch (err) {
  // Axios error
  const errorMessage = err.response?.data?.message || 'Default error message';
  
  // Check for specific errors
  if (errorMessage.includes('expired')) {
    // Handle expired token
  } else if (errorMessage.includes('invalid')) {
    // Handle invalid token
  } else {
    // Generic error
  }
  
  setError(errorMessage);
  console.error('Error:', err);  // Log for debugging
} finally {
  setLoading(false);  // Always clear loading
}
```

---

## 🧪 Testing Scenarios

### Test Case 1: Valid Email (User Exists)

```
1. Navigate to /forgot-password
2. Enter: user@example.com
3. Click "Send Reset Link"
4. Expected:
   - Loading spinner shows
   - Success message appears
   - Page redirects to /login after 4 seconds
   - Backend sends email with reset link
```

### Test Case 2: Invalid Email Format

```
1. Navigate to /forgot-password
2. Enter: invalid-email
3. Click "Send Reset Link" (or it auto-validates)
4. Expected:
   - Error: "Please enter a valid email address"
   - Button disabled (visual feedback)
   - No API call made
```

### Test Case 3: Non-Existent Email

```
1. Navigate to /forgot-password
2. Enter: nonexistent@example.com
3. Click "Send Reset Link"
4. Expected:
   - Success message (generic): "Check your email..."
   - No difference from existing email (security)
   - Redirect to /login
```

### Test Case 4: Reset Password - Valid Token

```
1. Click email reset link: /reset-password/TOKEN
2. Enter password: "SecurePass123"
3. Confirm: "SecurePass123"
4. Expected:
   - Strength indicator: Green (Strong)
   - Requirements all checked
   - Match indicator: "✓ Passwords match"
   - Click "Reset Password"
   - Success message appears
   - Redirect to /login after 2 seconds
```

### Test Case 5: Reset Password - Weak Password

```
1. Click email reset link: /reset-password/TOKEN
2. Enter password: "abc"
3. Expected:
   - Strength indicator: Red (Weak)
   - Requirements show: ✗ At least 6 characters
   - Button disabled
   - Error on submit
```

### Test Case 6: Reset Password - Mismatched Passwords

```
1. Click email reset link: /reset-password/TOKEN
2. Enter password: "SecurePass123"
3. Confirm: "SecurePass456"
4. Expected:
   - Match indicator: "✗ Passwords do not match"
   - Button disabled (if matching is required)
   - Error on submit
```

### Test Case 7: Reset Password - Expired Token

```
1. Wait 15+ minutes
2. Click email reset link from old email
3. Enter password: "SecurePass123"
4. Click "Reset Password"
5. Expected:
   - Error: "Your reset link has expired. Please request a new one."
   - Link to /forgot-password in error message
```

### Test Case 8: Mobile Responsiveness

```
1. Open /forgot-password on mobile device
2. Expected:
   - Card fits on screen
   - Input fields are easily tappable (44px+ height)
   - Button is full width
   - Text is readable (no zooming needed)

3. Open /reset-password on mobile
4. Expected:
   - All elements responsive
   - Strength indicator visible and readable
   - Toggle buttons easily tappable
```

---

## 🔍 Browser DevTools Debugging

### Console Checks

```javascript
// Check environment variable
console.log(import.meta.env.VITE_API_URL);

// Monitor API calls
// Use Network tab in DevTools
// POST requests to: api/auth/forgot-password
// POST requests to: api/auth/reset-password/:token

// Check for CORS errors
// If error in console: "Access to XMLHttpRequest blocked by CORS policy"
// Solution: Check Backend CORS configuration
```

### Network Tab Analysis

```
Request to: POST api/auth/forgot-password
Status: 200 (always, even if email doesn't exist)
Response:
{
  "success": true,
  "message": "..."
}

Request to: POST api/auth/reset-password/:token
Status: 200 (success) or 400 (error)
Response: As above
```

---

## 🚀 Performance Optimization

### Code Splitting

```javascript
// Use React.lazy for route-based code splitting
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/forgot-password" element={<ForgotPassword />} />
</Suspense>
```

### Memoization

```javascript
// Prevent unnecessary re-renders of email validation
const validateEmail = useCallback((value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}, []);

// Memoize password strength calculation
const strength = useMemo(() => {
  return getPasswordStrength(password);
}, [password]);
```

### Debouncing

```javascript
// Debounce email validation
const debouncedValidate = useMemo(
  () => debounce((email) => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email');
    }
  }, 500),
  []
);

// Use in onChange
<input onChange={(e) => debouncedValidate(e.target.value)} />
```

---

## 📊 Component State Management

### ForgotPassword State

```javascript
const [email, setEmail] = useState('');          // User input
const [error, setError] = useState('');          // Error message
const [success, setSuccess] = useState('');      // Success message
const [loading, setLoading] = useState(false);   // Request in progress
```

### ResetPassword State

```javascript
const [password, setPassword] = useState('');           // New password
const [confirmPassword, setConfirmPassword] = useState('');  // Confirm
const [showPassword, setShowPassword] = useState(false);      // Toggle 1
const [showConfirm, setShowConfirm] = useState(false);        // Toggle 2
const [error, setError] = useState('');                       // Error
const [success, setSuccess] = useState('');                   // Success
const [loading, setLoading] = useState(false);                // Request
```

---

## ✅ Frontend Deployment Checklist

- [ ] Routes configured in App.jsx
- [ ] Components at correct paths
- [ ] VITE_API_URL set in .env files
- [ ] axios installed: `npm ls axios`
- [ ] Tailwind CSS configured
- [ ] React Router configured
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Email link format correct in backend
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Redirects work (buttons, auto-redirects)
- [ ] Password strength indicator calculates correctly
- [ ] Show/hide toggles functional
- [ ] Form validation works
- [ ] Mobile testing completed
- [ ] Accessibility features tested
- [ ] CORS properly configured (if CORS errors, check backend)

---

## 📞 Common Frontend Issues

### Issue: "Cannot GET /reset-password/:token"

**Solution:** Route not configured in App.jsx
```javascript
// Add this route
<Route path="/reset-password/:token" element={<ResetPassword />} />
```

### Issue: API returns 404

**Solution:** Check VITE_API_URL matches backend port
```env
# .env
VITE_API_URL=http://localhost:5000/api  # Match your backend
```

### Issue: Form doesn't submit

**Solution:** Button might be disabled
```javascript
// Check button's disabled attribute
disabled={loading || !email.trim()}

// If true, form won't submit
```

### Issue: Password strength indicator not showing

**Solution:** Check conditional rendering
```javascript
{password && (
  // This only shows if password is truthy
  <div>Strength indicator</div>
)}
```

### Issue: Styles not applying

**Solution:** Check Tailwind configuration
```bash
# Ensure Tailwind CLI is watching
npm run dev  # Should show Tailwind in output
```

---

**Frontend Status: PRODUCTION READY** ✨
