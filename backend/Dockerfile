FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose backend port
EXPOSE 5000

CMD ["node", "server.js"]
