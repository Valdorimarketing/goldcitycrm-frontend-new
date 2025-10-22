FROM node:20

WORKDIR /usr/src/app

COPY . ./

# Build sırasında env dosyasını kullan
COPY docker/dev/env/.env .env

RUN npm install

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Build sırasında .env dosyasındaki değerler kullanılacak
RUN npm run build

# Güvenlik için .env dosyasını sil
RUN rm -f .env

CMD ["npm", "run", "start"]
