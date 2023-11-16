<h1 align="center">
Docker Lab
</h1>

## Contributors:
-   Azer Chabbar (Group2)
-   Ala ben hamouda (Group2)
-   Taoufik Kaabi (Group1)

## Overview:
The purpose of this lab is to create a CI/CD pipeline using **docker** to containerize our application coupled with **Jenkins** to create a build , test and deploy pipeline.
In order to achieve this we created a **nestJs** application for basic user management that stores data in a **mongodb** database with **mongo-express** as a data visualization tool.


## Phases:

### Phase 1 (Manual Configuration):
In this phase we manually executed the commands to start the containers as well as creating a docker network so that the **mongo** and **mongo-express** containers can communicate.
-   Create a docker network so that the **mongo** container can reach the **mongo-express** container.
    ```bash
    docker network create mongo-network
    ```
-   Starting the mongodb database:
    ```bash
    docker run -d --network mongo-network --name mongo  -e MONGO_INITDB_ROOT_USERNAME=azer  -e MONGO_INITDB_ROOT_PASSWORD=azer  mongo
    ```
    this command will check pull the latest version of the mongo image exist on the host's machine if it doesn't exist or simply start it otherwise.We notice the presence of certain flags on this command:
    -  d: run the container in detached mode so that it frees up the terminal for any additional commands.
    - network: the docker network that this container will run on.
    - name: the container name.
    - e: specify the environment variables(root username and password) which will later on be used by nestjs to reach the database.
  -   Starting the mongo-express data visualizer:
      ```bash
          docker run -p 8081:8081 -d -e ME_CONFIG_MONGODB_ADMINUSERNAME=azer -e ME_CONFIG_MONGODB_ADMINPASSWORD=azer -e ME_CONFIG_MONGODB_SERVER=mongo --name mongo-express --network mongo-network mongo-express
      ```
      this command will check pull the latest version of the mongo express image exist on the host's machine if it doesn't exist or simply start it otherwise.We notice the presence of certain flags on this command:
      - p: create a binding between the host's port and the docker container's port 8081:8081 means that any request to the host's 8081 port will be fowarded the mongo-express's 8081 port.
      - e: the environment variables needed (the mongodb root user and password as well as the mongo server which is the name of mongo container)
  
-   Launching our nestjs application :
    -   installing the dependencies
    ```bash
            npm install
      ```
    - starting the application:
    ```bash
            npm start
    ```
This manual configuration can get tedious as we have to re-execute it whenever we restart the machine which brings us to the next phase.

### Phase 2 (Docker compose + Dockerfile):
#### Docker-compose:
In order to orchestrate the launch of our different docker containers we can use a yaml file to define our services and the configuration that they need
```

version: '3'

services:
  mongo:
    image: mongo
    container_name: mongo
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=azer
      - MONGO_INITDB_ROOT_PASSWORD=azer

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=azer
      - ME_CONFIG_MONGODB_ADMINPASSWORD=azer
      - ME_CONFIG_MONGODB_SERVER=mongo
    ports:
      - "8081:8081"
    depends_on:
      - mongo
  nest-app:
    build:
      context: ./
      dockerfile: Dockerfile
    container_name: nest-app
    ports:
      - "3000:3000"
    environment:
      - DB_URL=mongodb://azer:azer@mongo:27017
    depends_on:
      - mongo
```
Inside our services we define our containers giving them name and the images that these containers were created from.
We can use the environment block to define our environment variables instead of doing so by the -e flag in the docker start command.
the depends on block define precedence relationships between our containers since **mongo** needs to start before **mongo-express**.
The advantage in using such a file is that docker will automatically create a network and bind our container's application to this network so that they can reach one another.
We notice the presence of a build block that takes a dockerfile as input.This is used so that instead of having to run our application manually we define a blueprint inside the `Dockerfile` on how to create and run this application and turn it into an image that can be ran inside the `compose.yaml` file automatically(we will later on dive into Dockerfile and how it works).
let's now start our containers using this file by running the command.
```bash
    sudo docker-compose -f compose.yaml up 
```
We notice that upon executing this command we get the following output:
```Creating network "mock-app_default" with the default driver``` which confirms that docker-compose does indeed create the network automatically.
If we want to shut down these containers and remove them as well as the network we can run :
```bash
    sudo docker-compose -f compose.yaml down 
```
#### DockerFile:
This file acts as a blueprint that creates the image for our container:
```
# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/mock-app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy copy the contents of the host machine into the app directory
COPY . .

# Expose the port your NestJS application is running on
EXPOSE 3000

# Define the command to start the NestJS application
CMD ["npm", "start"]
```
We start-off by defining our base image which is node this means that our container will come preinstalled with node version 18,
we then create the main directory where our application file will reside
```WORKDIR /usr/src/mock-app``` this means that any command that will be executed from this dockerfile will be executed inside this virtual folder that lives inside the container.
We copy our dependencies inside the app directory and we run them.
We notice the existence of two copy commands.This is due to the fact that docker has a caching mechanism and by copying only the package files first, Docker can cache this step separately. If there are no changes to the package files, Docker can reuse the cached layer during subsequent builds without having to reinstall the dependencies if they didn't change saving time.
We then define the starting point of our application specifies in other words the default command that will be executed when a container is started.
