
FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port for development
EXPOSE 9802


# Start the development server
CMD ["npm", "run", "dev"]