Working configuration for the Zeitgeist sdk:

```
import SDK from "@zeitgeistpm/sdk";

// endpoint is the websocket endpoint  like "wss://bsr.zeitgeist.pm"
const sdk = await SDK.default.initialize(endpoint); // for specifing the endpoint
const sdk = await SDK.default.initialize();  // for the default endpoint

// then you can fetch data
let marketCount = await sdk.models.getMarketCount()
```
