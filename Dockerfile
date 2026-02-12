FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci
COPY src ./src

EXPOSE 8080
USER node

CMD ["npx", "serve", "src", "-l", "8080"]

# FROM nginx:alpine
# COPY src/ /usr/share/nginx/html/
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
