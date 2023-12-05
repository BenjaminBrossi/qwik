FROM node:18-bullseye-slim AS build-env

COPY . /app
WORKDIR /app

# It is recommended that you only install production dependencies with
# `npm i --omit=dev`. You may need to check which dependencies are missing
RUN npm i


# A light-weight image for running the app
FROM gcr.io/distroless/nodejs18-debian11

COPY --from=build-env /app /app
WORKDIR /app

ENV AUTH_SECRET=6827e2769c422fbbabca271c0fb2c86e
ENV GOOGLE_CLIENT_ID=210082095227-dohnoasu8mlco1cght4ekjt7n3vbc122.apps.googleusercontent.com
ENV GOOGLE_SECRET=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
ENV MONGO_DB=mongodb+srv://benjamin:iWm7b7nukJ0kxsuK@cluster0.9pijxdt.mongodb.net/?retryWrites=true&w=majority=value

CMD ["server/entry.cloud-run.js"]
