# java
#
# Version JDK8

FROM java:8

MAINTAINER Feng Zhou, zhoufeng422@yzsj.net.cn

ADD target/meteo-0.1.war /app/

WORKDIR /app/

EXPOSE  8090

CMD ["java","-Duser.timezone=GMT+8","-jar","meteo-0.1.war"]