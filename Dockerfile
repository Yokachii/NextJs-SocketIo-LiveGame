FROM node:18.17.1-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start", "--", "--port", "5000"]
