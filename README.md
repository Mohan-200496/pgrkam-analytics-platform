# PGRKAM Analytics Platform

A comprehensive analytics platform for Punjab Government's PGRKAM initiative, featuring user behavior tracking, document verification, and personalized recommendations.

## Features

- Multi-portal government website simulation (10-20 sites)
- User registration with educational background tracking
- Document upload and verification system
- Machine learning-based resource recommendations
- Real-time analytics dashboard
- Admin interface for document verification

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for UI components
- Chart.js for data visualization
- Axios for API calls

### Backend
- FastAPI (Python)
- PostgreSQL for database
- JWT for authentication
- Celery for background tasks
- Redis for caching

### Machine Learning
- scikit-learn for recommendation engine
- TensorFlow for advanced analytics

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Redis

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables (create .env files in both backend and frontend)

5. Run migrations:
   ```bash
   cd backend
   alembic upgrade head
   ```

6. Start the development servers:
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `npm start`

## Project Structure

```
pgrkam-analytics-platform/
├── backend/               # Backend FastAPI application
│   ├── app/               # Application code
│   │   ├── api/           # API routes
│   │   ├── core/          # Core configurations
│   │   ├── db/            # Database configurations
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── tests/             # Test files
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # Frontend React application
    ├── public/            # Static files
    └── src/               # Source code
        ├── components/    # Reusable UI components
        ├── pages/         # Page components
        ├── hooks/         # Custom React hooks
        ├── context/       # React context providers
        ├── services/      # API services
        ├── assets/        # Images, fonts, etc.
        ├── styles/        # Global styles
        └── utils/         # Helper functions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
