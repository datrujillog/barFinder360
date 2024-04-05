FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY /src /src

RUN npm rebuild bcrypt --build-from-source

EXPOSE 5000

CMD ["npm","run", "dev"]