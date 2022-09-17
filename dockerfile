FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "createDB"]

CMD ["npm", "migrateDB"]

CMD ["npm", "migrateSeeders"]

CMD ["npm", "start"]


