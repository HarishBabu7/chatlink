======================================================
  ChatLink — Setup Guide (Read This First)
======================================================

This is the full step-by-step guide. Do each
step in order. Do not skip anything.

------------------------------------------------------
STEP 1 — Create a Firebase Project
------------------------------------------------------
1. Go to  https://firebase.google.com
2. Click "Get started for free"
3. Sign in with your Google account
4. Click "Create a project"
5. Give it any name (e.g. "chatlink")
6. Click through and finish creating it

------------------------------------------------------
STEP 2 — Add a Web App to Firebase
------------------------------------------------------
1. You are now on the Firebase Console
2. Click the icon that looks like  </>
   (it says "Web" when you hover it)
3. Give the app any name (e.g. "chatlink")
4. Click "Register app"
5. You will see a code block with your config.
   COPY all the values. You will need them next.
6. Click "Continue to console"

------------------------------------------------------
STEP 3 — Enable Firestore Database
------------------------------------------------------
1. On the left sidebar click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Pick any location (closest to you is fine)
5. Click "Create"
6. Now click the "Rules" tab at the top
7. DELETE everything in the rules editor
8. Paste this EXACTLY:

   rules_version = '2';
   service cloud.firestore {
     match /databases/(default)/documents {
       match /chats/{roomId} {
         allow read, write: if true;
       }
       match /chats/{roomId}/messages/{messageId} {
         allow read, write: if true;
       }
     }
   }

9. Click "PUBLISH"

------------------------------------------------------
STEP 4 — Put Your Config Into the Code
------------------------------------------------------
1. Open the file:  src/firebase.js
2. Replace the placeholder values with the ones
   you copied in Step 2. It looks like this:

   const firebaseConfig = {
     apiKey:            "AIzaSy...........",
     authDomain:        "chatlink-xxxxx.firebaseapp.com",
     projectId:         "chatlink-xxxxx",
     storageBucket:     "chatlink-xxxxx.appspot.com",
     messagingSenderId: "1234567890",
     appId:             "1:123456:web:abc123..."
   };

   Just replace the "YOUR_..." text with your real values.

------------------------------------------------------
STEP 5 — Install and Run Locally
------------------------------------------------------
Open your terminal and run these commands one by one:

   cd chatlink
   npm install
   npm start

After "npm start", open your browser and go to:
   http://localhost:3000

The app should be running.

------------------------------------------------------
STEP 6 — How To Use It
------------------------------------------------------
1. You open the app. You are the OWNER.
2. Tap "+ New" to create a new chat.
3. Type your friend's name and tap "Create Link".
4. A link is generated. Tap "Copy Link".
5. Send that link to your friend (WhatsApp, etc).
6. Tap "Open Chat →" to go to your chat view.
7. Your friend opens the link on THEIR phone.
8. They see the landing page and tap "Open Chat".
9. Their phone asks for location permission. They allow it.
10. Now you can both chat. You see their location
    in the card at the top of your chat.

------------------------------------------------------
STEP 7 — Deploy to the Internet (so the link works)
------------------------------------------------------
Right now the app only works on localhost.
To make the link work on your friend's phone
you need to host it online. Easiest free option:

   A) Go to  https://vercel.com
   B) Create a free account
   C) Click "New Project" → Import from GitHub
      (push your code to GitHub first)
      OR just drag and drop your folder
   D) Vercel gives you a URL like:
      https://chatlink-abc123.vercel.app
   E) That URL is your app. The links you
      generate inside the app will now work
      on any phone in the world.

Alternative free hosts:  Netlify, Railway, Render

------------------------------------------------------
FILES IN THIS PROJECT
------------------------------------------------------
package.json          → dependencies and scripts
src/firebase.js       → YOUR Firebase config (edit this)
src/index.js          → React entry point
src/App.js            → Router (all routes)
src/styles.css        → all the CSS
src/pages/
  OwnerDashboard.js   → your home screen (list of chats)
  CreateRoom.js       → create a new link
  OwnerChat.js        → your chat view (with location card)
  FriendLanding.js    → what friend sees when opening link
  FriendChat.js       → friend's chat view
firestore.rules.txt   → the rules (already pasted in Step 3)
public/index.html     → the HTML entry point
======================================================
