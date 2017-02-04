FROM node:6
#change timezone to local  ( America / Sao_Paulo)
#RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
# add project to build
ADD . /root/app
WORKDIR /root/app
RUN npm install && \
    npm -g install gulp-cli && \
    gulp ts

EXPOSE 3000
CMD ["npm","start"]