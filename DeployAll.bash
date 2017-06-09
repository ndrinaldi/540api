#!/bin/bash

cd /Users/nicholasrinaldi/www-540-api/Clients
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/ContractVehicles
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/Partners
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/Projects
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/Services
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/TeamMembers
serverless deploy

cd /Users/nicholasrinaldi/www-540-api/Config
serverless deploy
