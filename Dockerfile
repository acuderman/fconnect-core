FROM node:12.18.4
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --only=production
RUN npm i rimraf

COPY . .

RUN npm run build
EXPOSE 9998

CMD ["npm", "run", "start"]
