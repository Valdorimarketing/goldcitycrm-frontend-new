FROM node:20

WORKDIR /usr/src/app

COPY . ./
COPY docker/prod/env/.env ./.env
RUN npm install

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

RUN npm run build

CMD ["npm", "run", "start"]
