FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm ci
COPY . ./
RUN npm run build
RUN npm install -g serve
CMD serve -s build
EXPOSE 80