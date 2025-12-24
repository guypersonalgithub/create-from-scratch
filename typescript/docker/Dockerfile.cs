FROM node:20.11.0-alpine3.19 AS base
WORKDIR /usr/src/app
COPY ./apps/cs/package.json ./package.json
COPY ./apps/cs/package-lock.json ./package-lock.json
COPY ./apps/cs/package.json ./apps/cs/package.json
COPY ./packages/icons/package.json ./packages/icons/package.json
COPY ./packages/mathml/package.json ./packages/mathml/package.json
COPY ./packages/math-parser/package.json ./packages/math-parser/package.json
COPY ./packages/string-utils/package.json ./packages/string-utils/package.json
COPY ./packages/regex/package.json ./packages/regex/package.json
COPY ./packages/dynatic-css/package.json ./packages/dynatic-css/package.json
COPY ./packages/dynatic-css-utils/package.json ./packages/dynatic-css-utils/package.json
COPY ./packages/router/package.json ./packages/router/package.json
COPY ./packages/utils/package.json ./packages/utils/package.json
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
COPY ./packages/element-utils/package.json ./packages/element-utils/package.json
COPY ./packages/calculate-relative-position/package.json ./packages/calculate-relative-position/package.json
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
COPY ./packages/binary/package.json ./packages/binary/package.json
COPY ./packages/myers-visualizer/package.json ./packages/myers-visualizer/package.json
COPY ./packages/canvas-utils/package.json ./packages/canvas-utils/package.json
COPY ./packages/math/package.json ./packages/math/package.json
COPY ./packages/request-animation-frame/package.json ./packages/request-animation-frame/package.json
COPY ./dev-packages/dynatic-css-vite-plugin/package.json ./dev-packages/dynatic-css-vite-plugin/package.json
COPY ./dev-packages/dynatic-css-typescript-parser/package.json ./dev-packages/dynatic-css-typescript-parser/package.json
COPY ./dev-packages/typescript-file-manipulation/package.json ./dev-packages/typescript-file-manipulation/package.json
COPY ./dev-packages/recursive-import-iteration/package.json ./dev-packages/recursive-import-iteration/package.json
COPY ./packages/import-parser/package.json ./packages/import-parser/package.json
COPY ./packages/export-parser/package.json ./packages/export-parser/package.json



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
COPY ./packages/string-utils ./packages/string-utils
COPY ./packages/regex ./packages/regex
COPY ./packages/dynatic-css ./packages/dynatic-css
COPY ./packages/dynatic-css-utils ./packages/dynatic-css-utils
COPY ./packages/router ./packages/router
COPY ./packages/utils ./packages/utils
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
COPY ./packages/element-utils ./packages/element-utils
COPY ./packages/calculate-relative-position ./packages/calculate-relative-position
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
COPY ./packages/binary ./packages/binary
COPY ./packages/myers-visualizer ./packages/myers-visualizer
COPY ./packages/canvas-utils ./packages/canvas-utils
COPY ./packages/math ./packages/math
COPY ./packages/request-animation-frame ./packages/request-animation-frame
COPY ./dev-packages/dynatic-css-vite-plugin ./dev-packages/dynatic-css-vite-plugin
COPY ./dev-packages/dynatic-css-typescript-parser ./dev-packages/dynatic-css-typescript-parser
COPY ./dev-packages/typescript-file-manipulation ./dev-packages/typescript-file-manipulation
COPY ./dev-packages/recursive-import-iteration ./dev-packages/recursive-import-iteration
COPY ./packages/import-parser ./packages/import-parser
COPY ./packages/export-parser ./packages/export-parser
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
COPY ./packages/string-utils ./packages/string-utils
COPY ./packages/regex ./packages/regex
COPY ./packages/dynatic-css ./packages/dynatic-css
COPY ./packages/dynatic-css-utils ./packages/dynatic-css-utils
COPY ./packages/router ./packages/router
COPY ./packages/utils ./packages/utils
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
COPY ./packages/element-utils ./packages/element-utils
COPY ./packages/calculate-relative-position ./packages/calculate-relative-position
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
COPY ./packages/binary ./packages/binary
COPY ./packages/myers-visualizer ./packages/myers-visualizer
COPY ./packages/canvas-utils ./packages/canvas-utils
COPY ./packages/math ./packages/math
COPY ./packages/request-animation-frame ./packages/request-animation-frame
COPY ./dev-packages/dynatic-css-vite-plugin ./dev-packages/dynatic-css-vite-plugin
COPY ./dev-packages/dynatic-css-typescript-parser ./dev-packages/dynatic-css-typescript-parser
COPY ./dev-packages/typescript-file-manipulation ./dev-packages/typescript-file-manipulation
COPY ./dev-packages/recursive-import-iteration ./dev-packages/recursive-import-iteration
COPY ./packages/import-parser ./packages/import-parser
COPY ./packages/export-parser ./packages/export-parser
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
COPY ./packages/string-utils ./packages/string-utils
COPY ./packages/regex ./packages/regex
COPY ./packages/dynatic-css ./packages/dynatic-css
COPY ./packages/dynatic-css-utils ./packages/dynatic-css-utils
COPY ./packages/router ./packages/router
COPY ./packages/utils ./packages/utils
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
COPY ./packages/element-utils ./packages/element-utils
COPY ./packages/calculate-relative-position ./packages/calculate-relative-position
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
COPY ./packages/binary ./packages/binary
COPY ./packages/myers-visualizer ./packages/myers-visualizer
COPY ./packages/canvas-utils ./packages/canvas-utils
COPY ./packages/math ./packages/math
COPY ./packages/request-animation-frame ./packages/request-animation-frame
COPY ./dev-packages/dynatic-css-vite-plugin ./dev-packages/dynatic-css-vite-plugin
COPY ./dev-packages/dynatic-css-typescript-parser ./dev-packages/dynatic-css-typescript-parser
COPY ./dev-packages/typescript-file-manipulation ./dev-packages/typescript-file-manipulation
COPY ./dev-packages/recursive-import-iteration ./dev-packages/recursive-import-iteration
COPY ./packages/import-parser ./packages/import-parser
COPY ./packages/export-parser ./packages/export-parser
CMD ["sh", "-c", "while :; do sleep 2073600; done"]