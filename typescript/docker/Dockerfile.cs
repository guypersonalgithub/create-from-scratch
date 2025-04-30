FROM node:20.11.0-alpine3.19 AS base
WORKDIR /usr/src/app
COPY ./apps/cs/package.json ./package.json
COPY ./apps/cs/package-lock.json ./package-lock.json
COPY ./apps/cs/package.json ./apps/cs/package.json
COPY ./packages/icons/package.json ./packages/icons/package.json
COPY ./packages/mathml/package.json ./packages/mathml/package.json
COPY ./packages/math-parser/package.json ./packages/math-parser/package.json
COPY ./packages/utils/package.json ./packages/utils/package.json
COPY ./packages/router/package.json ./packages/router/package.json
COPY ./packages/url/package.json ./packages/url/package.json
COPY ./packages/environment/package.json ./packages/environment/package.json
COPY ./packages/hooks/package.json ./packages/hooks/package.json
COPY ./packages/array-utils/package.json ./packages/array-utils/package.json
COPY ./packages/object-utils/package.json ./packages/object-utils/package.json
COPY ./packages/parse-typescript/package.json ./packages/parse-typescript/package.json
COPY ./packages/sidebar/package.json ./packages/sidebar/package.json
COPY ./packages/animation-container/package.json ./packages/animation-container/package.json
COPY ./packages/is-dev/package.json ./packages/is-dev/package.json
COPY ./packages/button/package.json ./packages/button/package.json
COPY ./packages/tooltip/package.json ./packages/tooltip/package.json
COPY ./packages/randomizer/package.json ./packages/randomizer/package.json
COPY ./packages/edge-intersection/package.json ./packages/edge-intersection/package.json
COPY ./packages/collapsible/package.json ./packages/collapsible/package.json
COPY ./packages/auto-complete-input/package.json ./packages/auto-complete-input/package.json
COPY ./packages/typeahead/package.json ./packages/typeahead/package.json
COPY ./packages/input/package.json ./packages/input/package.json
COPY ./packages/loading/package.json ./packages/loading/package.json
COPY ./packages/virtual-list/package.json ./packages/virtual-list/package.json
COPY ./packages/table/package.json ./packages/table/package.json
COPY ./packages/pagination/package.json ./packages/pagination/package.json
COPY ./packages/copy-to-clipboard/package.json ./packages/copy-to-clipboard/package.json
COPY ./packages/calculations-table/package.json ./packages/calculations-table/package.json
COPY ./packages/title/package.json ./packages/title/package.json
COPY ./packages/syntax-highlighter/package.json ./packages/syntax-highlighter/package.json
COPY ./packages/parse-yaml/package.json ./packages/parse-yaml/package.json
COPY ./packages/ui-theme/package.json ./packages/ui-theme/package.json
COPY ./packages/css-utils/package.json ./packages/css-utils/package.json
COPY ./packages/radio-button/package.json ./packages/radio-button/package.json
COPY ./packages/scrollspy-anchors/package.json ./packages/scrollspy-anchors/package.json
COPY ./packages/breadcrumbs/package.json ./packages/breadcrumbs/package.json



FROM base as development
WORKDIR /usr/src/app
ENV NODE_ENV development
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install
USER node
COPY --chown=node:node ./apps/cs ./
COPY ./packages/icons ./packages/icons
COPY ./packages/mathml ./packages/mathml
COPY ./packages/math-parser ./packages/math-parser
COPY ./packages/utils ./packages/utils
COPY ./packages/router ./packages/router
COPY ./packages/url ./packages/url
COPY ./packages/environment ./packages/environment
COPY ./packages/hooks ./packages/hooks
COPY ./packages/array-utils ./packages/array-utils
COPY ./packages/object-utils ./packages/object-utils
COPY ./packages/parse-typescript ./packages/parse-typescript
COPY ./packages/sidebar ./packages/sidebar
COPY ./packages/animation-container ./packages/animation-container
COPY ./packages/is-dev ./packages/is-dev
COPY ./packages/button ./packages/button
COPY ./packages/tooltip ./packages/tooltip
COPY ./packages/randomizer ./packages/randomizer
COPY ./packages/edge-intersection ./packages/edge-intersection
COPY ./packages/collapsible ./packages/collapsible
COPY ./packages/auto-complete-input ./packages/auto-complete-input
COPY ./packages/typeahead ./packages/typeahead
COPY ./packages/input ./packages/input
COPY ./packages/loading ./packages/loading
COPY ./packages/virtual-list ./packages/virtual-list
COPY ./packages/table ./packages/table
COPY ./packages/pagination ./packages/pagination
COPY ./packages/copy-to-clipboard ./packages/copy-to-clipboard
COPY ./packages/calculations-table ./packages/calculations-table
COPY ./packages/title ./packages/title
COPY ./packages/syntax-highlighter ./packages/syntax-highlighter
COPY ./packages/parse-yaml ./packages/parse-yaml
COPY ./packages/ui-theme ./packages/ui-theme
COPY ./packages/css-utils ./packages/css-utils
COPY ./packages/radio-button ./packages/radio-button
COPY ./packages/scrollspy-anchors ./packages/scrollspy-anchors
COPY ./packages/breadcrumbs ./packages/breadcrumbs
CMD ["npm", "run", "dev"]



FROM base as production
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm ci --only=production
USER node
COPY --chown=node:node ./apps/cs ./
COPY ./packages/icons ./packages/icons
COPY ./packages/mathml ./packages/mathml
COPY ./packages/math-parser ./packages/math-parser
COPY ./packages/utils ./packages/utils
COPY ./packages/router ./packages/router
COPY ./packages/url ./packages/url
COPY ./packages/environment ./packages/environment
COPY ./packages/hooks ./packages/hooks
COPY ./packages/array-utils ./packages/array-utils
COPY ./packages/object-utils ./packages/object-utils
COPY ./packages/parse-typescript ./packages/parse-typescript
COPY ./packages/sidebar ./packages/sidebar
COPY ./packages/animation-container ./packages/animation-container
COPY ./packages/is-dev ./packages/is-dev
COPY ./packages/button ./packages/button
COPY ./packages/tooltip ./packages/tooltip
COPY ./packages/randomizer ./packages/randomizer
COPY ./packages/edge-intersection ./packages/edge-intersection
COPY ./packages/collapsible ./packages/collapsible
COPY ./packages/auto-complete-input ./packages/auto-complete-input
COPY ./packages/typeahead ./packages/typeahead
COPY ./packages/input ./packages/input
COPY ./packages/loading ./packages/loading
COPY ./packages/virtual-list ./packages/virtual-list
COPY ./packages/table ./packages/table
COPY ./packages/pagination ./packages/pagination
COPY ./packages/copy-to-clipboard ./packages/copy-to-clipboard
COPY ./packages/calculations-table ./packages/calculations-table
COPY ./packages/title ./packages/title
COPY ./packages/syntax-highlighter ./packages/syntax-highlighter
COPY ./packages/parse-yaml ./packages/parse-yaml
COPY ./packages/ui-theme ./packages/ui-theme
COPY ./packages/css-utils ./packages/css-utils
COPY ./packages/radio-button ./packages/radio-button
COPY ./packages/scrollspy-anchors ./packages/scrollspy-anchors
COPY ./packages/breadcrumbs ./packages/breadcrumbs
CMD ["npm", "run", "build"]



FROM base as debugFiles
WORKDIR /usr/src/app
ENV NODE_ENV debugFiles
RUN --mount=type=cache,target=/usr/src/app/.npm \ 
    npm set cache /usr/src/app/.npm && \ 
    npm install
USER node
COPY --chown=node:node ./apps/cs ./
COPY ./packages/icons ./packages/icons
COPY ./packages/mathml ./packages/mathml
COPY ./packages/math-parser ./packages/math-parser
COPY ./packages/utils ./packages/utils
COPY ./packages/router ./packages/router
COPY ./packages/url ./packages/url
COPY ./packages/environment ./packages/environment
COPY ./packages/hooks ./packages/hooks
COPY ./packages/array-utils ./packages/array-utils
COPY ./packages/object-utils ./packages/object-utils
COPY ./packages/parse-typescript ./packages/parse-typescript
COPY ./packages/sidebar ./packages/sidebar
COPY ./packages/animation-container ./packages/animation-container
COPY ./packages/is-dev ./packages/is-dev
COPY ./packages/button ./packages/button
COPY ./packages/tooltip ./packages/tooltip
COPY ./packages/randomizer ./packages/randomizer
COPY ./packages/edge-intersection ./packages/edge-intersection
COPY ./packages/collapsible ./packages/collapsible
COPY ./packages/auto-complete-input ./packages/auto-complete-input
COPY ./packages/typeahead ./packages/typeahead
COPY ./packages/input ./packages/input
COPY ./packages/loading ./packages/loading
COPY ./packages/virtual-list ./packages/virtual-list
COPY ./packages/table ./packages/table
COPY ./packages/pagination ./packages/pagination
COPY ./packages/copy-to-clipboard ./packages/copy-to-clipboard
COPY ./packages/calculations-table ./packages/calculations-table
COPY ./packages/title ./packages/title
COPY ./packages/syntax-highlighter ./packages/syntax-highlighter
COPY ./packages/parse-yaml ./packages/parse-yaml
COPY ./packages/ui-theme ./packages/ui-theme
COPY ./packages/css-utils ./packages/css-utils
COPY ./packages/radio-button ./packages/radio-button
COPY ./packages/scrollspy-anchors ./packages/scrollspy-anchors
COPY ./packages/breadcrumbs ./packages/breadcrumbs
CMD ["sh", "-c", "while :; do sleep 2073600; done"]