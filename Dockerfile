# Build stage - 使用跨平台 Node 镜像
FROM --platform=$BUILDPLATFORM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --registry=https://registry.npmmirror.com

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - 使用跨平台 nginx 镜像 (支持 ARM64 和 AMD64)
FROM nginx:1.25-alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8081
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
