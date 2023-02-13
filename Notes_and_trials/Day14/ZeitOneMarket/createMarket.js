let endpoint = "wss://roc.zeitgeist.pm/"
const sdk = await SDK.initialize(endpoint);
// Bernhard wrote this 
// wss://roc.zeitgeist.pm/

const marketId = await sdk.models.createMarket({
  signer,
  oracle,
  period: marketPeriod,
  metadata,
  creationType: advised ? `Advised` : `Permissionless`,
  marketType: { Scalar: bounds ? bounds : [0, 100] },
  mdm,
  scoringRule: cpmm ? `CPMM` : `RikiddoSigmoidFeeMarketEma`,
  callbackOrPaymentInfo: false,
});

