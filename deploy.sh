#!/bin/bash
# ==============================================================================
# Mahathi Tailor Shop - Interactive Production Deployment Assistant (Linux/macOS)
# ==============================================================================

clear
echo "=============================================================================="
echo "                 👑 MAHATHI TAILOR SHOP - ATELIER DEPLOYMENT DESK 👑"
echo "=============================================================================="
echo ""
echo " This helper utility assists in publishing your bundle-free luxury"
echo " Single Page Application directly to standard production web hosts."
echo ""
echo " Select your target cloud hosting service:"
echo ""
echo " [1] Vercel (Recommended - 10-Second Deploy)"
echo " [2] Netlify Hosting"
echo " [3] Firebase Hosting (Integrates Cloud Firestore & Auth)"
echo " [4] Cancel & Exit"
echo ""
echo "=============================================================================="
read -p "Atelier Choice (1-4): " choice

case $choice in
  1)
    clear
    echo "=============================================================================="
    echo "                 🚀 DEPLOYING TO VERCEL COUTURE CLOUD"
    echo "=============================================================================="
    echo ""
    echo " Prerequisites:"
    echo " 1. Node.js & NPM installed locally."
    echo " 2. Vercel CLI installed globally: \"npm install -g vercel\""
    echo ""
    echo " Deploying current folder directly..."
    echo ""
    vercel
    ;;
  2)
    clear
    echo "=============================================================================="
    echo "                 🚀 DEPLOYING TO NETLIFY ATELIER EDGE"
    echo "=============================================================================="
    echo ""
    echo " Prerequisites:"
    echo " 1. Node.js & NPM installed locally."
    echo " 2. Netlify CLI installed globally: \"npm install -g netlify-cli\""
    echo ""
    echo " To initialize netlify, run:"
    echo "   \"netlify init\""
    echo ""
    echo " To deploy directly, run:"
    echo "   \"netlify deploy --prod --dir=.\""
    echo ""
    read -p "Would you like to run Netlify deploy now? (Y/N): " net_run
    if [[ $net_run =~ ^[Yy]$ ]]; then
      netlify deploy --prod --dir=.
    fi
    ;;
  3)
    clear
    echo "=============================================================================="
    echo "                 🚀 DEPLOYING TO GOOGLE FIREBASE HOSTING"
    echo "=============================================================================="
    echo ""
    echo " Prerequisites:"
    echo " 1. Firebase CLI installed globally: \"npm install -g firebase-tools\""
    echo " 2. Active Firebase console project with Firestore & Auth enabled."
    echo ""
    echo " Steps:"
    echo " 1. Run \"firebase login\" to authenticate."
    echo " 2. Run \"firebase init hosting\" (or select existing project)."
    echo " 3. Run \"firebase deploy\" to publish live."
    echo ""
    read -p "Would you like to trigger Firebase deploy now? (Y/N): " fb_run
    if [[ $fb_run =~ ^[Yy]$ ]]; then
      firebase deploy
    fi
    ;;
  4)
    echo ""
    echo "Atelier deployment deferred. Thank you."
    exit 0
    ;;
  *)
    echo ""
    echo "[WARNING] Invalid selection. Exiting."
    exit 1
    ;;
esac

echo ""
echo "=============================================================================="
echo " Atelier Deployment Completed! Open the returned URL in your browser."
echo "=============================================================================="
