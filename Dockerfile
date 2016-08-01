FROM node:latest

RUN npm install -g typescript webpack

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app/src

RUN npm install
RUN npm link typescript
RUN tsc
RUN webpack

EXPOSE 3000

ENTRYPOINT [ "node", "www.js" ]
