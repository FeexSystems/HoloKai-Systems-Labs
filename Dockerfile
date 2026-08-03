# HoloKai Backend Production Dockerfile
# GCP Cloud Run deployment for project: third-glazing-k7c1c

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Set environment variables for Cloud Run
ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV HOSTED_PROVIDER=gemini
ENV GCP_PROJECT=third-glazing-k7c1c

EXPOSE 8000

# Run FastAPI backend using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
