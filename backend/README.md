# Insurance Fraud Detection API

AI-powered FastAPI backend for insurance claim processing and fraud detection.

## Features

- 🤖 **AI Fraud Detection**: Keras/TensorFlow model integration for automated fraud analysis
- 🔐 **JWT Authentication**: Secure user authentication with role-based access
- 📸 **Image Processing**: Support for file uploads and base64 encoded images
- 💾 **SQLite Database**: Easy setup with async SQLAlchemy ORM
- 📊 **Auto-generated API Docs**: Interactive documentation at `/docs`
- 🌐 **CORS Enabled**: Ready for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd c:\Users\HP\Documents\projects\insurance\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
copy .env.example .env
# Edit .env with your settings if needed
```

### 3. Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login (form data)
- `POST /api/auth/login-json` - Login (JSON body)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Claims
- `POST /api/claims` - Create new claim with images
- `GET /api/claims` - List all claims (with filters)
- `GET /api/claims/{id}` - Get claim details
- `PUT /api/claims/{id}` - Update claim status
- `DELETE /api/claims/{id}` - Delete claim

### AI Analysis
- `POST /api/analyze/fraud` - Analyze image for fraud (file upload)
- `POST /api/analyze/fraud/base64` - Analyze image (base64)
- `POST /api/analyze/damage` - Damage severity assessment
- `POST /api/analyze/batch` - Batch analysis (up to 10 images)

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── models/
│   ├── database.py        # SQLAlchemy models
│   └── ml_model.py        # AI model wrapper
├── schemas/
│   ├── user_schemas.py    # User Pydantic schemas
│   ├── claim_schemas.py   # Claim Pydantic schemas
│   └── ai_schemas.py      # AI analysis schemas
├── routes/
│   ├── auth.py            # Authentication endpoints
│   ├── claims.py          # Claims management endpoints
│   └── ai_analysis.py     # AI analysis endpoints
└── utils/
    ├── auth_utils.py      # JWT & password utilities
    └── image_processor.py # Image processing utilities
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT secret key | Generate with `openssl rand -hex 32` |
| `DATABASE_URL` | Database connection | `sqlite+aiosqlite:///./insurance.db` |
| `MODEL_PATH` | Path to Keras model | `../cars_claim_model.keras` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:5173` |

## AI Model

The backend loads the Keras model from `cars_claim_model.keras`. The model:
- Input: 224x224 RGB images
- Output: Fraud probability and damage classification
- Preprocessing: Auto-resize and normalize images

## Database Schema

- **users**: User accounts with roles (owner, agent, admin)
- **claims**: Insurance claims with vehicle info
- **ai_analysis_results**: AI predictions linked to claims
- **comments**: Comments on claims

## Development

### Run with auto-reload
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Test AI Model
```bash
python -c "from models.ml_model import FraudDetectionModel; model = FraudDetectionModel(); print('Model loaded successfully')"
```

## Frontend Integration

The Vite frontend should proxy API requests to this backend. Add to `vite.config.ts`:

```typescript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
}
```

## Production Deployment

1. **Change SECRET_KEY** in `.env` to a secure random string
2. **Use PostgreSQL** instead of SQLite for production
3. **Enable HTTPS** with reverse proxy (nginx, Caddy)
4. **Set DEBUG=False** in production
5. **Use production ASGI server** like Gunicorn with Uvicorn workers

Example production command:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

MIT
