FROM node:0.10
USER root
RUN useradd -u 1000 -g 50 docker
RUN npm -g install uglify-js
RUN mkdir -p /var/www/app
WORKDIR /var/www/app
RUN chmod 777 /var/www/app
CMD [ "make" ]
