FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

CMD ["node","build/index.js","-f","parameters/rss.json"]