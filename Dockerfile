FROM node:8.4

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app

RUN ./run.sh client install
RUN ./run.sh client release
RUN ./run.sh server install
RUN ./run.sh server build

ENTRYPOINT ["/usr/app/run.sh"]
CMD ["start"]
