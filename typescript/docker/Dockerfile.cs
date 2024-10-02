FROM node:20.11.0-alpine3.19 AS base
WORKDIR /usr/src/app
COPY ./apps/cs/package.json ./package.json
COPY ./apps/cs/package-lock.json ./package-lock.json
COPY ./apps/cs/package.json ./apps/cs/package.json



FROM base as development
WORKDIR /usr/src/app
ENV NODE_ENV development
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install
USER node
COPY --chown=node:node ./apps/cs ./
CMD ["npm", "run", "dev"]



FROM base as production
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm ci --only=production
USER node
COPY --chown=node:node ./apps/cs ./
CMD ["npm", "run", "build"]



FROM base as debugFiles
WORKDIR /usr/src/app
ENV NODE_ENV debugFiles
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install
USER node
COPY --chown=node:node ./apps/cs ./
CMD ["sh", "-c", "while :; do sleep 2073600; done"]