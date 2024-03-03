# template: https://github.com/dinhtrivonguyen/nestjs-docker/blob/master/Dockerfile
FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN apk add curl
RUN npm run download:icons
RUN npm run build:prod

FROM nginx:1.21-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=development /usr/src/app/www/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]
