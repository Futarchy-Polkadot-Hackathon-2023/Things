#!/bin/bash
curl 'https://kusama.webapi.subscan.io/api/v2/scan/events' \
  --data-raw '{"address":"","row":25,"page":0,"module":"bounties","event_id":""}' \
