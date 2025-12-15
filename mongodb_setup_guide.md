# 🍃 MongoDB Atlas Setup Guide for LifeOS

To fix the backend error, you need a database connection string. The easiest way is to use **MongoDB Atlas** (Free Tier). Follow these exact steps:

## Step 1: Create an Account
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up (Google Sign-up is fastest).
3.  Fill out the welcome questions (just select "Learning" or "Build an Application").

## Step 2: Create a Cluster
1.  On the **Deploy a database** screen, select the **M0 (FREE)** option (usually on the far right).
2.  Choose a Provider (AWS is fine) and a Region close to you (e.g., Mumbai `ap-south-1` since you mentioned it before).
3.  Click **Create Deployment** at the bottom.

## Step 3: Create a Database User
1.  You will see a "Security Quickstart".
2.  **Username**: `pj_lifeos` (or whatever you prefer).
3.  **Password**: Click "Autogenerate Secure Password" (Copy this! You need it).
4.  Click **Create Database User**.

## Step 4: Whitelist Your IP
1.  Scroll down to "IP Access List".
2.  Click **"Add My Current IP Address"** (This ensures only you can access it).
3.  Click **Finish and Close**.

## Step 5: Get the Connection String
1.  Go to your Database Deployment overview.
2.  Click the **Connect** button next to your cluster name.
3.  Select **Drivers** (Node.js should be selected by default).
4.  **COPY** the connection string. It will look something like this:
    `mongodb+srv://pj_lifeos:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Update LifeOS Config
1.  Open the file `server/.env` in VS Code.
2.  Find `MONGO_URI=...`
3.  Paste your copied string.
4.  **IMPORTANT**: Replace `<password>` in the string with the actual password you copied in Step 3.
    *   *Incorrect*: `...:pj_lifeos:<password>@...`
    *   *Correct*: `...:pj_lifeos:MySecretPassword123@...`
5.  Save the file.

The server will restart automatically. If you see `MongoDB Connected`, you are done! 🚀
