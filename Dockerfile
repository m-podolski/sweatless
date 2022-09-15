# syntax=docker/dockerfile:1

FROM node:16.17-alpine3.16 as build

WORKDIR /app
COPY package.json ./

WORKDIR /app/backend
COPY backend/package.json ./
RUN npm i
COPY backend ./
RUN npx nest build

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm i
COPY frontend ./
RUN npm run build


FROM node:16.17-alpine3.16 as production
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build app/backend/dist ./backend/dist/
COPY --from=build app/frontend/build ./frontend/build/
COPY --from=build app/backend/package.json ./backend/

ARG USER=sweatless
RUN addgroup -S sweatgroup && \
  adduser -S $USER -G sweatgroup && \
  chown -R $USER:sweatgroup /app
USER $USER

WORKDIR /app/backend
RUN npm i --omit=dev

EXPOSE 3001
CMD node dist/main
