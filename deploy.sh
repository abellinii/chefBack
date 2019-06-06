#!/bin/bash

EB_APP="mywebapp-api"
STAGING_BRANCH="master"
PRODUCTION_BRANCH="production"

# Determine the environment to deploy to based on which branch this commit is on
NODE_ENV=''
if [[ $TRAVIS_BRANCH == $STAGING_BRANCH ]]; then
  NODE_ENV="staging"
elif [[ $TRAVIS_BRANCH == $PRODUCTION_BRANCH ]]; then
  NODE_ENV="production"
else
  # Don't want to deploy if it's not one of the above branches
  echo "Not deploying"
  exit
fi

EB_ENV="$EB_APP-$NODE_ENV"
echo "Deploying to $EB_ENV"

pip install --user --upgrade awsebcli

# Configure AWS credentials for Elastic Beanstalk
mkdir -p ~/.aws
echo '[profile eb-cli]' > ~/.aws/config
echo "aws_access_key_id = $AWS_ACCESS_KEY_ID" >> ~/.aws/config
echo "aws_secret_access_key = $AWS_SECRET_ACCESS_KEY" >> ~/.aws/config
eb status

# Deploy application to the appropriate ElasticBeanstalk env
eb deploy $EB_ENV -v
rm ~/.aws/config