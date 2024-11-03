FROM 353013733335.dkr.ecr.ap-south-1.amazonaws.com/dlp-ecr-repository:digital-golden-image_latest-test-dev-SNAPSHOT AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./

RUN npm install --omit=dev 

COPY . .

RUN npm run build

# remove development dependencies
RUN npm prune --omit=dev

# run node prune
RUN /usr/local/bin/node-prune

# Build app as production, ignoring the non-required types/dev dependencies to make app lightweight.
FROM 353013733335.dkr.ecr.ap-south-1.amazonaws.com/dlp-ecr-repository:digital-golden-image_latest-test-prod-SNAPSHOT AS production

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/main"]