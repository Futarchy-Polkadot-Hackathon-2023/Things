# Squid template project

A starter [Squid](https://subsquid.io) project to demonstrate its structure and conventions.
It accumulates [kusama](https://kusama.network) bounty events and serves them via GraphQL API.

## Summary

- [Based on ]()
- [Main docs for subsquid templates in general]()
- [(but read in conjunction with these docs)]()

## Prerequisites

* node 16.x
* docker
* npm -- note that `yarn` package manager is not supported

## Quickly running the sample

```bash
# 0. have docker running

# 1. installation
npm run update
npm ci

# 2. Clean old files if anything has been changed
sqd down
sqd migration:clean

# 3. Start target Postgres database and detach
sqd up

# 4. prepare db and processor
sqd codegen
sqd migration:generate

# 5. Start the processor
sqd process

# 6. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
sqd serve

# 7. Try out queries in a [local graphQL explorer](http://localhost:4350/graphql)

```
