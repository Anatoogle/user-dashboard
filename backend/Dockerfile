# Use Node.js 22 as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Compile the TypeScript code into JavaScript
RUN npm run build

# Document that the application uses port 3000
EXPOSE 3000

# Start the compiled backend application
CMD ["npm", "start"]