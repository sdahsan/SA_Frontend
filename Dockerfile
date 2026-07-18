#step 1 pull image alpine from github
FROM node:26-alpine

#Define working directory
WORKDIR /app

# Step 3: Copy package configuration files first to speed up future builds
COPY package*.json ./

# Step 4: Install your application dependencies inside the clean container
RUN npm install

# Step 5: Copy your actual local backend application code
COPY . .

# Step 6: Inform Docker that your app listens on port 5010
EXPOSE 5173

# Step 7: The execution command that boots up your Node server
CMD ["npm", "start"]

