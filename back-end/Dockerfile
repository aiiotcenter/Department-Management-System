# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory for file uploads
RUN mkdir -p uploads/cvs QRcodes

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 