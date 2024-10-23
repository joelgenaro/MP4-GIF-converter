# Dockerfile for Express
FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN apk add --no-cache ffmpeg
CMD ["node", "index.js"]