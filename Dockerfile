FROM node:22-slim
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn i --frozen-lockfile && yarn build:server
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node", "dist/server/server.js"]