FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# tests/ and public/ will be mounted at runtime

CMD ["npx", "playwright", "test"]
