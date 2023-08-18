FROM node:lts-alpine3.18 as build-stage

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /Popcorn-web

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# production stage
FROM nginx:stable-alpine3.17 as production-stage

COPY ./nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /Popcorn-web/dist /usr/share/nginx/html

RUN apk add --no-cache tzdata

ENV TZ Asia/Kolkata

RUN cp /usr/share/zoneinfo/$TZ /etc/localtime

EXPOSE 4040

CMD ["nginx", "-g", "daemon off;"]