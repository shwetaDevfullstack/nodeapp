# Fundamental Instructions
ARG NODE_VERSION=12.13.0
FROM node:${NODE_VERSION}
# FROM devshweta/repo-node-app:s-nodeapp

# MEATADATA
# LABEL Creator: "Shweta"

# copy our local package.json
RUN mkdir -p /opt/app
COPY package.json /opt/app/package.json
RUN cd /opt/app && npm install
# COPY package-lock.json /tmp/package-lock.json
# RUN cd /tmp && npm install
# RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

#  change our work directory to the /opt/app 
WORKDIR /opt/app
# copy all our project code from our local host into the image app directory
ADD . /opt/app

EXPOSE 8082
CMD ["npm", "start"]

