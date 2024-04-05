# Use Node.js base image
FROM node:latest

# Copy package.json and yarn.lock to container
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the application files
COPY . .

RUN yarn build

# Expose port if necessary
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]