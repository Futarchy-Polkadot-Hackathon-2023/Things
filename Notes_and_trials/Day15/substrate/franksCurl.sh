#!/bin/bash

curl 'http://localhost:4350/graphql' \
  -H 'Origin: http://localhost:4350' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query MyQuery {events(limit: 10) {id name}}","variables":null,"operationName":"MyQuery"}' \
