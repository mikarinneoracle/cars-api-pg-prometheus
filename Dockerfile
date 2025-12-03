FROM node:22.20-alpine

ARG APIGW_PATH

WORKDIR /app

COPY ./ /app

RUN sed -i "s|/cars:|${APIGW_PATH}/cars:|g" index.js
RUN sed -i "s|/car/{id}:|${APIGW_PATH}/car/{id}:|g" index.js
RUN sed -i "s|/price/{name}:|${APIGW_PATH}/price/{name}:|g" index.js

RUN npm install

CMD [ "node", "index.js" ]