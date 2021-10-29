# Stage 1
FROM node:14.4-alpine3.11 as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build


# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
