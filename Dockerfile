
# Load the alpine base image
FROM node:8




# Create the working directory
RUN mkdir -p /var/www/api

# Copy project files into the working directory
COPY . /var/www/api/


RUN npm install

# Set the working directory to the created directory
WORKDIR /var/www/api

# Expose a port and start the server (you may need to change the name here to match your server file)
EXPOSE 3000
CMD ["node", "server.js"]
