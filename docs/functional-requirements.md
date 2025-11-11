# Functional Requirements

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