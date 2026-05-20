# 🚀 INSTALL PACKAGES - TWO EASY OPTIONS

## Option 1: Double-Click (Easiest for Windows)
1. Go to: `backend` folder
2. Find: `INSTALL_PACKAGES.bat`
3. **Double-click it**
4. Wait for "SUCCESS" message
5. Done! ✅

---

## Option 2: Manual Commands
In your backend terminal, run one line at a time:

```bash
npm cache clean --force
npm install bcryptjs
npm install jsonwebtoken
npm install
```

Then run:
```bash
npm run dev
```

---

## Option 3: One-Line Install
Copy and paste this entire line:

```bash
npm install bcryptjs jsonwebtoken && npm run dev
```

---

## ✅ What You Should See

**If successful:**
```
Server running on port 5000
```

**If packages are missing:**
```
⚠️  WARNING: Password saved as plain text - install bcryptjs!
Server running on port 5000
```
(System still works, but not secure)

---

## 🎯 Next Step

Once backend is running, open a NEW terminal:

```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`

---

## 🆘 If Nothing Works

Try complete reset:

1. Close all terminals
2. Go to `backend` folder
3. Delete: `node_modules` folder
4. Delete: `package-lock.json` file
5. Delete: `.npm` folder (if visible)
6. Open terminal in `backend` folder
7. Run: `npm install bcryptjs jsonwebtoken`
8. Run: `npm run dev`

---

**Pick any option above and try it! Let me know what happens. 🚀**
