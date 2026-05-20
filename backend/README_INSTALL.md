# ⚡ QUICK FIX FOR MISSING PACKAGES

## The Problem
```
Error: Cannot find module 'bcryptjs'
Error: Cannot find module 'jsonwebtoken'
```

## The Solution (Pick One)

### ✅ SOLUTION 1: Direct Installation (Fastest)
Copy and paste these commands into your backend terminal:

```bash
cd backend
npm install bcryptjs@2.4.3 --save
npm install jsonwebtoken@9.1.0 --save
npm run dev
```

**Wait for both to complete**, then you should see:
```
Server running on port 5000
```

---

### ✅ SOLUTION 2: Reinstall All Dependencies
If Solution 1 doesn't work:

```bash
cd backend
npm install
npm run dev
```

---

### ✅ SOLUTION 3: Complete Clean Slate
If Solutions 1 & 2 don't work:

```bash
cd backend
del package-lock.json
rmdir /s /q node_modules
npm install
npm run dev
```

---

## ✅ Verify It Worked

After running any solution, check for these in the output:
- ✅ "added X packages" message
- ✅ No error messages
- ✅ "Server running on port 5000"

---

## 🚀 Next Step

Once backend is running:

**Terminal 2:**
```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`

---

## 🆘 Still Not Working?

### Check Node.js
```bash
node --version
# Should be v16 or higher
```

### Check npm
```bash
npm --version
# Should be 8 or higher
```

### Try clearing cache
```bash
npm cache clean --force
npm install bcryptjs jsonwebtoken
```

### Check your internet
npm needs to download packages from the internet. If you have a proxy or firewall, that might block it.

---

## 📋 Manual Package Installation

If npm install fails, try these one-by-one:

```bash
npm i bcryptjs
npm i jsonwebtoken
npm i express
npm i mongoose
npm i cors
npm i dotenv
npm i nodemon -D
```

---

## ✨ Bottom Line

Just run in your backend terminal:
```bash
npm install bcryptjs jsonwebtoken && npm run dev
```

That's it! Should start working.

---

**If you get stuck, show me the error message and I'll help fix it!**
