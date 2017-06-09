FROM node:latest

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app

RUN ./run.sh install
RUN ./run.sh release

ENTRYPOINT ["/usr/app/run.sh"]
CMD ["start"]