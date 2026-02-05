# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_LINE_CLIENT_ID
ARG VITE_LINE_REDIRECT_URI
ARG VITE_LINE_OAUTH_STATE

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_LINE_CLIENT_ID=$VITE_LINE_CLIENT_ID
ENV VITE_LINE_REDIRECT_URI=$VITE_LINE_REDIRECT_URI
ENV VITE_LINE_OAUTH_STATE=$VITE_LINE_OAUTH_STATE

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
