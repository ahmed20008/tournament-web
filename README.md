# Project Setup Instructions

## Running Locally

### Install Dependencies

npm install

## Running the Project

### Start the Project

npm run dev

This command launches the project in development mode.

## Building for Production

### Create a Production Build

npm run build

## Firebase Configuration

Before running the project locally, configure Firebase:

1. Create an app in Firebase.
2. Add Firebase credentials to your `.env.local` file.
3. Enable authentication in the Firebase console.
4. Create a Firestore database in the Firebase console.

## Firestore Index Creation

To enable efficient class filtering, create the required index in the Firebase console:

1. Visit the Firebase console for your project.
2. Go to the Firestore database section.
3. Create the necessary composite index. Firestore may prompt you with a link if an index is required.

   Alternatively, manually create the composite index for the combination of `class` and `name` fields.

After completing these steps, you should be able to run the project locally with the class filter functionality working as expected.
