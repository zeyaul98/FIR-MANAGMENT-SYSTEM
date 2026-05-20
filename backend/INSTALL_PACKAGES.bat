@echo off
color 0A
title Railway FIR - Package Installation

echo.
echo ========================================
echo  Railway FIR - Installing Dependencies
echo ========================================
echo.

cd /d "C:\Users\user\OneDrive\Desktop\restt\railway FIR\backend"

echo Step 1: Clearing npm cache...
call npm cache clean --force
if errorlevel 1 (
    echo WARNING: Could not clear cache, continuing anyway...
)

echo.
echo Step 2: Installing bcryptjs...
call npm install bcryptjs
if errorlevel 1 (
    echo ERROR: Failed to install bcryptjs
    pause
    exit /b 1
)

echo.
echo Step 3: Installing jsonwebtoken...
call npm install jsonwebtoken
if errorlevel 1 (
    echo ERROR: Failed to install jsonwebtoken
    pause
    exit /b 1
)

echo.
echo Step 4: Verifying all dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! All packages installed!
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
