# FraudShield: A Real-time Fraud Detection System

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

## Functional Requirements

### 1. User Authentication

-   **1.1 Login:** Users must be able to log into the application using their credentials (email and password). (Note: Currently implemented as a mock login for demonstration purposes).
-   **1.2 Session Management:** The system shall maintain a user session after a successful login.

### 2. Dashboard

-   **2.1 Dashboard View:** After logging in, the user shall be redirected to the main dashboard.
-   **2.2 Layout:** The dashboard shall consist of a transaction simulation form, a real-time prediction display area, and a transaction history log.
-   **2.3 Navigation:** A persistent sidebar shall provide navigation links to the main sections of the app (e.g., Dashboard).

### 3. Transaction Simulation

-   **3.1 Transaction Form:** The system shall provide a form for users to input transaction details.
-   **3.2 Form Fields:** The form must include fields for:
    -   Transaction Amount (in INR)
    -   Transaction Time (datetime)
    -   Transaction Location (text)
    -   Merchant Details (text)
-   **3.3 Input Validation:** The system shall validate all form inputs to ensure they are in the correct format and meet required constraints (e.g., amount must be a positive number).
-   **3.4 Form Submission:** Users shall be able to submit the form to trigger a fraud prediction.

### 4. Fraud Prediction

-   **4.1 Real-time Analysis:** Upon form submission, the system shall send the transaction data to the AI backend for real-time analysis.
-   **4.2 Prediction Display:** The system shall display the AI's prediction result on the dashboard.
-   **4.3 Prediction Details:** The displayed result must include:
    -   A clear status (e.g., "Potential Fraud Detected" or "Transaction Appears Legitimate").
    -   A confidence score (as a percentage) indicating the model's certainty.
    -   Visual cues (e.g., colors, icons) to quickly communicate the fraud status.

### 5. Transaction History

-   **5.1 Transaction Log:** The system shall log every simulated transaction and its prediction result.
-   **5.2 History Table:** The log shall be displayed in a table on the dashboard.
-   **5.3 Table Columns:** The history table must display the following for each transaction:
    -   Fraud Status (e.g., "Fraud" or "Legit")
    -   Amount
    -   Location
    -   Merchant
    -   Time
-   **5.4 Empty State:** If no transactions have been simulated, the table shall display a message indicating that it is empty.

## Hardware & Software Requirements

### For End-Users (Accessing the Application)

-   **Hardware**:
    -   A computer or mobile device with a stable internet connection.
-   **Software**:
    -   Any modern web browser (e.g., Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).

### For Development (Running the Project Locally)

-   **Hardware**:
    -   **Processor**: Dual-core processor or better.
    -   **RAM**: 8 GB minimum, 16 GB recommended for a smoother experience.
    -   **Storage**: 5 GB of free disk space for project files and dependencies.
-   **Software**:
    -   **Operating System**: Windows 10/11, macOS, or a modern Linux distribution.
    -   **Node.js**: Version 18.x or 20.x recommended.
    -   **Package Manager**: `npm` (comes with Node.js) or `yarn`.
    -   **Code Editor**: A modern code editor like Visual Studio Code is recommended.
    -   **Git**: For version control.
