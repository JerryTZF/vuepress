FROM nginx:alpine

COPY docs/.vuepress/dist/ /usr/share/nginx/html