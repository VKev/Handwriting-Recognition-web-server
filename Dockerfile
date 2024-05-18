# Use a base image with Python pre-installed
FROM python:3.12.3-slim

# Install Node.js v20.12.2
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs=20.12.2-1nodesource1

# Install build tools including make
RUN apt-get install -y build-essential

# Set working directory for Flask server
WORKDIR /app/flask_process_server

# Copy Flask server files
COPY Flask_Server/ .

# Install Python dependencies
RUN pip install -r requirements.txt

# Set working directory for Node.js server
WORKDIR /app/nodejs_server

# Copy Node.js server files
COPY Nodejs_Server/ .

# Install npm dependencies
RUN npm install

# Rebuild bcrypt to match the architecture
RUN npm rebuild bcrypt --build-from-source

# Command to run both servers
CMD npm start & python /app/flask_process_server/server.py
