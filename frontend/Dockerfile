# base image
FROM node:12.18.3

# set working directory
WORKDIR /app


# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@10.1.1

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0



# docker build -t example:dev .


# docker run -v ${PWD}:/app -v /app/node_modules -p 4201:4200 --rm example:dev


# more info
