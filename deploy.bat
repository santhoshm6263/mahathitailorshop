@echo off
:: ==============================================================================
:: Mahathi Tailor Shop - Interactive Production Deployment Assistant (Windows)
:: ==============================================================================

cls
color 0E
echo ==============================================================================
echo                 👑 MAHATHI TAILOR SHOP - ATELIER DEPLOYMENT DESK 👑
echo ==============================================================================
echo.
echo  This helper utility assists in publishing your bundle-free luxury
echo  Single Page Application directly to standard production web hosts.
echo.
echo  Select your target cloud hosting service:
echo.
echo  [1] Vercel (Recommended - 10-Second Deploy)
echo  [2] Netlify Hosting
echo  [3] Firebase Hosting (Integrates Cloud Firestore & Auth)
echo  [4] Cancel & Exit
echo.
echo ==============================================================================
set /p choice="Atelier Choice (1-4): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto firebase
if "%choice%"=="4" goto exit_script
goto invalid_choice

:vercel
cls
echo ==============================================================================
echo                 🚀 DEPLOYING TO VERCEL COUTURE CLOUD
echo ==============================================================================
echo.
echo  Prerequisites:
echo  1. Node.js & NPM installed locally.
echo  2. Vercel CLI installed globally: "npm install -g vercel"
echo.
echo  Deploying current folder directly...
echo.
vercel
goto complete

:netlify
cls
echo ==============================================================================
echo                 🚀 DEPLOYING TO NETLIFY ATELIER EDGE
echo ==============================================================================
echo.
echo  Prerequisites:
echo  1. Node.js & NPM installed locally.
echo  2. Netlify CLI installed globally: "npm install -g netlify-cli"
echo.
echo  To initialize netlify, run:
echo    "netlify init"
echo.
echo  To deploy directly, run:
echo    "netlify deploy --prod --dir=."
echo.
set /p net_run="Would you like to run Netlify deploy now? (Y/N): "
if /I "%net_run%"=="Y" (
  netlify deploy --prod --dir=.
)
goto complete

:firebase
cls
echo ==============================================================================
echo                 🚀 DEPLOYING TO GOOGLE FIREBASE HOSTING
echo ==============================================================================
echo.
echo  Prerequisites:
echo  1. Firebase CLI installed globally: "npm install -g firebase-tools"
echo  2. Active Firebase console project with Firestore & Auth enabled.
echo.
echo  Steps:
echo  1. Run "firebase login" to authenticate.
echo  2. Run "firebase init hosting" (or select existing project).
echo  3. Run "firebase deploy" to publish live.
echo.
set /p fb_run="Would you like to trigger Firebase deploy now? (Y/N): "
if /I "%fb_run%"=="Y" (
  firebase deploy
)
goto complete

:invalid_choice
echo.
echo  [WARNING] Invalid selection. Please choose a value from 1 to 4.
pause
goto vercel

:complete
echo.
echo ==============================================================================
echo  Atelier Deployment Completed! Open the returned URL in your browser.
echo ==============================================================================
pause
exit

:exit_script
echo.
echo  Atelier deployment deferred. Thank you.
exit
