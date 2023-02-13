1. Go to [Link](https://app.zeitgeist.pm/markets/123)
2. Type `yarn cli --help`
3. Type `yarn cli queryMarketIds`
4. Type `yarn cli queryMarket 123` 
5. Command queryMarket takes an ID as Input, this is ID is the same as in the URL of the LINK.
6. Type `yarn cli queryMarket 123 >> queryMarket123`
7. Its save the output of queryMarket ID call
8. Open queryMarket123 with `nano queryMarket123` and delete everything what is not .json, save it. Sweet.
9. Type `cat queryMarket123` 
10. Pipe it `cat queryMarket123 | jq` 
11. jq is a nice commandlineTerminal for json processing. I stole this from viki, he used that quite often^^ [jq Website](https://stedolan.github.io/jq/)


