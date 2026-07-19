# Step 1: Pull standard Node alpine image
FROM node:20-alpine

# Define working directory
WORKDIR /app

# Step 3: Copy package configuration files
COPY package*.json ./

# Step 4: Install your application dependencies
RUN npm install

# Step 5: Copy your actual local frontend application code
COPY . .

# Declare the variables so Jenkins can bake your Azure IP into the compilation
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Step 6: Compile your project to generate optimized, static production files inside /app/dist
RUN npm run build

# 🔥 PRODUCTION FIX: Install a native, lightweight static file server globally
RUN npm install -g serve

# Step 7: Inform Docker that your app listens on port 3000
EXPOSE 3000

# Step 8: Serve the compiled static assets directly out of the build directory
CMD ["serve", "-s", "dist", "-l", "3000"]