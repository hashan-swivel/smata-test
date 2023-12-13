
# Build stage
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
#FROM node:18
#WORKDIR /usr/src/app
#COPY --from=builder /usr/src/app/next.config.js ./
#COPY --from=builder /usr/src/app/public ./public
#COPY --from=builder /usr/src/app/.next ./.next
#COPY --from=builder /usr/src/app/node_modules ./node_modules
#COPY --from=builder /usr/src/app/package.json ./
#COPY --from=builder /usr/src/app/yarn.lock ./

# Install production dependencies
#RUN yarn install --frozen-lockfile --production

# Use a non-root user for better security
#RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
#USER nextj

CMD ["yarn", "start"]
