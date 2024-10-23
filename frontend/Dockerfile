FROM node:14-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
