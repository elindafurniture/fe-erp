FROM node:23.7-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["sleep", "infinity"]