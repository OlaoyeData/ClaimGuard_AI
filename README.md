# ClaimGuard AI

ClaimGuard AI is an intelligent insurance claim fraud detection system. It leverages artificial intelligence to analyze claim data and images, assigning credibility scores to help insurance companies detect and prevent fraud efficiently.

## 🚀 Features

*   **AI-Powered Fraud Detection:** Uses a TensorFlow/Keras model to analyze claim details and images for potential fraud.
*   **Real-time Analysis:** Instant feedback on claim credibility with confidence scores.
*   **Interactive Dashboard:** Visual analytics for claim statistics and fraud trends using Recharts.
*   **Claims Management:** Complete workflow for submitting, viewing, and managing insurance claims.
*   **Secure Authentication:** JWT-based user authentication and authorization.
*   **Modern UI:** Responsive and user-friendly interface built with React, TypeScript, and TailwindCSS.

## 🛠️ Tech Stack

### Backend
*   **Framework:** FastAPI (Python)
*   **ML Engine:** TensorFlow / Keras
*   **Database:** SQLAlchemy (SQLite by default)
*   **Authentication:** Python-Jose (JWT), Passlib
*   **Data Validation:** Pydantic

### Frontend
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** TailwindCSS
*   **State Management:** React Hooks
*   **Charting:** Recharts
*   **HTTP Client:** Axios

## 📋 Prerequisites

*   Python 3.9+
*   Node.js 18+
*   npm or yarn

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/OlaoyeData/ClaimGuard_AI.git
cd ClaimGuard_AI
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

### 3. Frontend Setup
Open a new terminal and navigate to the clients directory:
```bash
cd clients
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📝 Usage

1.  **Register/Login:** Create an account or log in to access the dashboard.
2.  **Submit Claim:** Upload claim details and images.
3.  **View Analysis:** Get instant AI feedback on the claim's likelihood of fraud.
4.  **Dashboard:** Monitor overall claim statistics and fraud rates.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
