FROM node:16-alpine as builder

WORKDIR /usr/src/app    

COPY package*.json .

COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5555/udp
CMD [ "npm", "start" ]
# FROM node:16-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app    

# COPY package*.json .

# COPY prisma ./prisma/

# RUN npm ci --only=production

# COPY --from=build /usr/src/app/build ./build

# CMD ["node", "build/index.js"]