FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci
COPY src ./src

EXPOSE 8080
USER node

CMD ["npx", "serve", "src", "-l", "8080"]
