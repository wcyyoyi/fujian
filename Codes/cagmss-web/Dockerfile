FROM node:6-stretch
MAINTAINER Feng Zhou <zhoufeng422@yzsj.net.cn>

EXPOSE 81

RUN npm install http-server -g

RUN mkdir -p /usr/src/app
COPY /dist /usr/src/app

WORKDIR /usr/src/app
CMD ["http-server","-a","0.0.0.0","-p","81"]