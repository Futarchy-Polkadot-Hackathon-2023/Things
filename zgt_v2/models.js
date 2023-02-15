class MarketCreationResult {
    marketId;
    poolId;
    success;
    isMainnet;

    getUrl() {
        if (this.isTestnet != null && this.isTestnet) {
            return `https://app.zeitgeist.pm/markets/${this.marketId}`;
        }
        return `https://test.staging.zeitgeist.pm/markets/${this.marketId}`;
    }

}


class MarketCreationArguments {
    question;
    description;
    slug;
}