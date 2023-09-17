FROM node:20-alpine
WORKDIR /opt/app
ADD package.json package.json
ADD yarn.lock yarn.lock
RUN yarn 
ADD . .
RUN yarn build
CMD ["node", "dist/src/main.js"]
