FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ensure env file exists during build
COPY .env .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]