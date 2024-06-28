FROM node:20.11.0-alpine3.19 AS base

WORKDIR /usr/src/app

COPY ./apps/vue/package-lock.json ./apps/vue/package.json ./



FROM base as development

WORKDIR /usr/src/app

ENV NODE_ENV development

RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install

USER node

COPY --chown=node:node ./apps/vue ./

COPY --chown=node:node ./packages/micro-frontends ./packages/

CMD ["npm", "run", "dev"]



FROM base as production

WORKDIR /usr/src/app

ENV NODE_ENV production

RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm ci --only=production

USER node

COPY --chown=node:node ./apps/vue ./

COPY --chown=node:node ./packages/micro-frontends ./packages/

CMD ["npm", "run", "build"]



FROM base as debugFiles

WORKDIR /usr/src/app

ENV NODE_ENV debugFiles

RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install

USER node

COPY --chown=node:node ./apps/vue ./

COPY --chown=node:node ./packages/micro-frontends ./packages/

CMD ["sh", "-c", "while :; do sleep 2073600; done"]