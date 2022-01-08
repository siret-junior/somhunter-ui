FROM ubuntu:20.04

ENV TZ=Europe/Prague
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get -q update > /dev/null
RUN apt-get install -yq --no-install-recommends nodejs npm > /dev/null

WORKDIR /somhunter/somhunter-ui

EXPOSE 8080
