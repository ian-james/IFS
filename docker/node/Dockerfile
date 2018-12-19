FROM node:10-stretch

WORKDIR /

CMD cd /IFS && \
    CI=true npm install && \
    node ./config/index.js
