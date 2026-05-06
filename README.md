# Aroma Cafe - Online Presence Website

A modern, responsive, and production-ready cafe website built with React, Vite, Tailwind CSS, and Firebase.

## Features

- **Rich Aesthetics**: Custom Tailwind configuration with a warm, cafe-inspired color palette.
- **Responsive Design**: Mobile-first approach ensuring the website looks great on all devices.
- **Dark Mode**: Built-in dark mode toggle that persists using `localStorage`.
- **Dynamic Menu**: Category filtering without page reloads using Framer Motion animations.
- **Gallery**: Responsive image grid with a custom modal lightbox.
- **Reservation System**: Form validation with React Hook Form, submitting to Firebase Firestore.
- **Contact Page**: Integrated Google Maps embed and contact form.
- **Admin Dashboard**: Protected route to view reservations and messages (Password: `cafeadmin2025`).

## Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Backend/Database**: Firebase (Firestore)

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Go to **Build > Firestore Database** and click "Create database" (Start in Test Mode for development).
   - Go to **Project Settings > General** and scroll down to "Your apps". Click the Web (</>) icon to register an app.
   - Copy the Firebase configuration object.
   - Copy the `.env.example` file to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the values in the `.env` file with your Firebase configuration.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Deployment to Google Cloud Run

This application can be easily deployed to Google Cloud Run for a scalable, fully managed environment.

### Prerequisites
- Install the [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install).
- Authenticate with your Google Cloud account: `gcloud auth login`
- Set your Google Cloud project: `gcloud config set project YOUR_PROJECT_ID`
- Ensure Cloud Run API and Cloud Build API are enabled in your project.

### Deployment Steps

1. **Build and Deploy using Cloud Run Source Deployment:**
   Google Cloud Run will automatically detect the provided `Dockerfile`, build the container image, and deploy it to a managed environment.
   
   Run the following command from the root of your project:
   ```bash
   gcloud run deploy cafe-website --source . --platform managed --region us-central1 --allow-unauthenticated
   ```
   
   *Note: Ensure your `.env` variables are correctly configured in your Cloud Run environment settings if you are using Firebase.*

### How it Works
The project includes a multi-stage `Dockerfile` and an `nginx.conf` file:
1. The **first stage** builds the optimized Vite static assets (`npm run build`).
2. The **second stage** uses a lightweight Nginx server to serve these static assets on port 8080 (Cloud Run's default port).
3. The `nginx.conf` ensures that React Router's client-side routing functions perfectly by redirecting all unknown routes back to `index.html`.

## Mock Data Mode

If you run the application without setting up the `.env` variables for Firebase, the application will automatically fall back to a "Mock Data Mode". Form submissions will be logged to the console, and the Admin Dashboard will display hardcoded sample data. This is useful for previewing the UI without setting up a backend.
