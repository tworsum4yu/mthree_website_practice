# Base Image: node v24 on alpine linux
FROM node:24-alpine

# Creates new directory "app" inside container and copies dependency files into it
WORKDIR /app
COPY package.json package-lock.json ./

# Installs exact dependencies and copies "src" directory into new directory "src"
RUN npm ci
COPY src ./src

# Tells container to listen for requests on port 8080
# Sets user to a non-root node user for security
EXPOSE 8080
USER node

# npx runs serve, which serves src on port 8080
CMD ["npx", "serve", "src", "-l", "8080"]
