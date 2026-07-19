# Step 1: Pull standard Node alpine image
FROM node:20-alpine

# Define working directory
WORKDIR /app

# Step 3: Copy package configuration files
COPY package*.json ./

# Step 4: Install your application dependencies
RUN npm install

# Step 5: Copy your actual local backend application code
COPY . .

# 🔥 CRITICAL FIX: Declare the variables so Jenkins can bake your Azure IP into the compilation
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Step 6: Compile your project to generate optimized, static production files
RUN npm run build

# Step 7: Inform Docker that your app listens on port 3000
EXPOSE 3000

# Step 8: The execution command that serves your built application
# (Change to "npm run preview" or your framework's custom production hosting command if needed)
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
