# FraudShield: A Real-time Fraud Detection System

Web Page Preview Link: https://studio--studio-6007815239-4b141.us-central1.hosted.app


This project is a web application designed to simulate and detect fraudulent financial transactions in real-time. The system, named "FraudShield", provides a user-friendly dashboard where users can input transaction details and receive an immediate fraud prediction powered by a generative AI model.

## How It Works

The application features a dashboard with three main components:

1.  **Simulate Transaction:** A form where users can input details of a financial transaction, such as amount, time, location, and merchant information.
2.  **Real-time Prediction:** Upon submission, the transaction data is sent to a backend AI flow. The AI model analyzes the data and returns a prediction, indicating whether the transaction is likely fraudulent, along with a confidence score. This result is immediately displayed to the user.
3.  **Transaction History:** All simulated transactions and their corresponding fraud predictions are logged in a table, allowing users to review past activity.

## Project Scope

The scope of the FraudShield project is to serve as a high-fidelity simulator for real-time fraud detection. The system's functionality is centered around a web-based dashboard where users can manually input transaction details for immediate analysis. The core feature is the use of a pre-trained Large Language Model (Google's Gemini) to perform a real-time prediction, which is instantly displayed to the user with a confidence score and a breakdown of risk factors. All simulated transactions and their predictions are logged to a Firestore database for session-specific history review. For demonstration purposes, the project also includes an AI-powered feature to generate synthetic sample transactions.

Deliberately out of scope for this project are features such as custom machine learning model training, real user authentication and management (the login is a mock), integration with live financial data streams, batch processing of historical data files, and automated alerting to external services like email or SMS. The focus is strictly on demonstrating the analytical power of LLMs in a simulated but realistic environment.

## Technology Stack

The project is built using a modern, robust, and scalable technology stack:

-   **Framework:** **Next.js (App Router)** - A React framework for building full-stack web applications with server-side rendering and static site generation. The App Router is used for optimized rendering and layout management.
-   **Language:** **TypeScript** - A typed superset of JavaScript that enhances code quality and maintainability.
-   **UI Library:** **React** - A JavaScript library for building user interfaces with a component-based architecture.
-   **AI Integration:** **Google Gemini via Genkit** - An open-source framework from Firebase for building AI-powered applications. It is used to define and run the fraud prediction logic using Google's Gemini models.
-   **Component Library:** **ShadCN UI** - A collection of re-usable UI components built on top of Radix UI and Tailwind CSS, providing a clean and accessible design system.
-   **Styling:** **Tailwind CSS** - A utility-first CSS framework for rapid UI development and custom styling. The project uses CSS variables for easy theming (including light/dark modes).
-   **Form Management:** **React Hook Form** - For performant and flexible form state management.
-   **Schema Validation:** **Zod** - A TypeScript-first schema declaration and validation library, used for validating form inputs and AI model outputs.
-   **Icons:** **Lucide React** - A library of simply designed, beautiful icons.
-   **Hosting:** **Firebase App Hosting** - The application is configured for deployment on Firebase's managed, secure hosting platform for web apps.

