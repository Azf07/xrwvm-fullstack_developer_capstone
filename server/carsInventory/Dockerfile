# Base Docker image
FROM node:18.12.1-bullseye-slim

# Install npm version 9.1.3
RUN npm install -g npm@9.1.3

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port
EXPOSE 3050

# Start the application
CMD ["node", "app.js"]
