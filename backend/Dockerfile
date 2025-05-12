FROM python:3.11-slim-bookworm

# Set the working directory
WORKDIR /app

# Change if used normal python instead of Slim
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files
COPY .. .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port Django runs on
EXPOSE 8000

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

