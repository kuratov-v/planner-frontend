# BUILD STAGE
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PROD STAGE
FROM nginx:1.19.0-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d