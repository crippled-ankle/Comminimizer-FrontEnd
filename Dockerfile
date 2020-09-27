FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci
RUN npm run build
RUN npm install -g serve
CMD serve -s build
EXPOSE 80