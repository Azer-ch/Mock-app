# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/mock-app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your NestJS application is running on
EXPOSE 3000

# Define the command to start the NestJS application
CMD ["npm", "start"]