# IP or URL of the server you want to deploy to
APP_HOST=www.timelined.com

# If you want a different ROOT_URL, when using a load balancer for instance, set it here
#ROOT_URL=mycustom.url.com

# Comment this if your host is not an EC2 instance
# EC2_PEM_FILE=~/.ssh/proxynet.pem

# What's your project's Git repo?
GIT_URL=git@github.com:zenmatt/timeliner.git

# Does your project use meteorite, or plain meteor?
METEORITE=true

# If not using Meteorite, you need to specify this
METEOR_RELEASE=0.7.0.1

#If you have an external service, such as Google SMTP, set this
#MAIL_URL=smtp://USERNAME:PASSWORD@smtp.googlemail.com:465

# What's your app name?
APP_NAME=timeliner

# If your app is not on the repository root, set this
APP_PATH=app

# If you would like to use a different branch, set it here
GIT_BRANCH=master

# Kill the forever and node processes, and deletes the bundle directory and tar file prior to deploying
FORCE_CLEAN=false

# Setup a listening port for your instance / default is 80
#PORT=8000

# If you want to do something before forever starts Meteor, you can do it here
# NOTE: Don't forget to use a semi-colon at the end of every command
PRE_METEOR_START="export ENVIRONMENT=prod;"
