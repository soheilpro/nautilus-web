FROM node:8.4

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app

RUN ./run.sh client install && \
    ./run.sh client release && \
    ./run.sh server install && \
    ./run.sh server build

ENTRYPOINT ["/usr/app/run.sh"]
CMD ["server", "start"]
