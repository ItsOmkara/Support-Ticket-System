# Support Ticket System

A complete support ticket system built with Django (Backend), React (Frontend), and PostgreSQL (Database), featuring LLM-powered ticket classification.

## Features
- **Ticket Submission**: Users can create tickets with title and description.
- **AI Classification**: Real-time category and priority suggestions using OpenAI-compatible API.
- **Ticket Management**: List tickets with filters (category, priority, status) and search.
- **Stats Dashboard**: Live statistics showing ticket distribution by status and category.
- **Dockerized**: Fully containerized setup for easy deployment.

## Tech Stack
- **Backend**: Django, Django REST Framework
- **Frontend**: React, Vite, Lucide-React
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-3.5-turbo (or compatible API)
- **Containerization**: Docker, Docker Compose

## Setup Instructions

### 1. Prerequisites
- Docker and Docker Compose installed.
- OpenAI API Key.

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Build and Run
Run the following command to start the entire system:
```bash
docker-compose up --build
```

### 4. Access the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## Design Decisions
1. **Model-First Architecture**: Enforced constraints at the database level for data integrity.
2. **LLM Fallback**: Implemented graceful error handling for LLM timeouts or failures, falling back to "general" category.
3. **ORM Aggregation**: Used Django's `annotate` and `Count` for statistics to ensure performance.
4. **Vibrant UI**: Used a dark-themed CSS design with glassmorphism and smooth animations.
