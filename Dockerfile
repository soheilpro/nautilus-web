FROM node:latest

RUN npm install -g typescript webpack

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app/src

RUN npm install
RUN npm link typescript
RUN tsc
RUN webpack --config assets/app/scripts/webpack.config.js --context assets/app/scripts

EXPOSE 3000

ENTRYPOINT [ "node", "./out/www.js" ]
