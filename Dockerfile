# Double-container Dockerfile for separated build process.
# If you're just copy-pasting this, don't forget a .dockerignore!

# We're starting with the same base image, but we're declaring
# that this block outputs an image called DEPS that we
# won't be deploying - it just installs our npm deps
FROM node:16-alpine AS deps

# If you need libc for any of your deps, uncomment this line:
# RUN apk add --no-cache libc6-compat

# Copy over ONLY the package.json and package-lock.json
# so that this `npm install` layer is only recomputed
# if these dependency files change. Nice speed hack!
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci 

# END DEPS IMAGE

# Now we make a container to handle our Build
FROM node:16-alpine AS BUILD_IMAGE

# Set up our work directory again
WORKDIR /app

# Bring over the deps we installed and now also
# the rest of the source code to build the Next
# server for production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Remove all the development dependencies since we don't
# need them to run the actual server.
RUN rm -rf node_modules
RUN npm ci --production --no-audit --ignore-scripts --prefer-offline

# END OF BUILD_IMAGE

# This starts our application's run image - the final output of build.
FROM node:16-alpine

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Pull the built files out of BUILD_IMAGE - we need:
# 1. the package.json and package-lock.json
# 2. the Next build output and static files
# 3. the node_modules.
WORKDIR /app
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/public ./public
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/.next ./.next

# 4. OPTIONALLY the next.config.js, if your app has one
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/next.config.js  ./

# 5. Copy prod file to .env.local files
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/.env.prod  ./.env.local

COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/ethereum/build ./ethereum/build

USER nextjs

EXPOSE 3000

CMD [ "npm", "start" ]