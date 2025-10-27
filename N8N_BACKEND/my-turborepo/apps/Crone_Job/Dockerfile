
# stage 1 : Build the monorepo
FROM node:20-alpine AS builder

# set Working directory
WORKDIR /app

#copy all root files
COPY package*.json turbo.json ./


# copy all apps and packages
COPY apps ./apps
COPY packages ./packages

# install dependencies

RUN npm install 

# build only the current app

# nnnn
RUN npx  turbo run build --filter=crone_job

# RUN npx turbo run build --filter=autoworker...



# stage 2: Production images

FROM node:20-alpine AS builder2

WORKDIR /app

# Copy the built app from builder

# nnnnnn
COPY --from=builder /app/apps/Crone_Job/dist ./dist


COPY --from=builder /app/apps/Crone_Job/package*.json ./
# copy packages.josn for runtime dependancies

COPY --from=builder /app/packages ./packages


# Copy node_modules (with monorepo links)
COPY --from=builder /app/node_modules ./node_modules


CMD [ "node" , "dist/main.js" ]