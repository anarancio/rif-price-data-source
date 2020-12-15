const axios = require('axios');
const Big = require('big.js');

const price = () => {

    const fetchMxcPrice = async () => {
        const result = await axios.get('https://www.mxc.ceo/open/api/v2/market/ticker?api_key=mx0zdTKOl9cEnVnHto&symbol=RIF_BTC');
        const price = result.data.data[0].last;
        return Big(price);
    }

    const fetchKuCoin = async () => {
        const result = await axios.get('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=RIF-BTC');
        const price = result.data.data.price;
        return Big(price);
    }

    const fetchCoinbene = async () => {
        const result = await axios.get('https://openapi-exchange.coinbene.com/api/exchange/v2/market/ticker/one?symbol=RIF/BTC');
        const price = result.data.data.latestPrice;
        return Big(price);
    }

    const calculateAverage = async (prices) => {
        let average = Big('0');

        let weightSum = Big('0');

        prices.forEach(item => {
            let price = item.price;
            let weight = Big(item.weight);
            weightSum = weightSum.add(weight);
            
            average = average.add(price.times(weight));
        });

        return average.div(weightSum);
    }

    const fetchPrice = async () => {
        console.log("fetching price...");

        const min = Big('0.00000580');

        let prices = [];

        const mxcPrice = await fetchMxcPrice();
        const kuCoinPrice = await fetchKuCoin();
        const coinbenePrice = await fetchCoinbene();
        prices.push({
                        name: "mxc",
                        weight: '34',
                        price: mxcPrice
                    });
        prices.push({
                        name: "kucoin",
                        weight: '33',
                        price: kuCoinPrice
                    });
        prices.push({
                        name: "coinbene",
                        weight: '33',
                        price: coinbenePrice
                    });

        const average = await calculateAverage(prices);
        let finalPrice = average;
        
        if (finalPrice.lt(min)) {
            finalPrice = min;
        }

        global.pricing = finalPrice.toPrecision(8);
        global.ts = Date.now();
        console.log("price fetched: MXC[%s] KUCOIN[%s] COINBENE[%s] AVERAGE[%s] FINAL[%s]", mxcPrice.toString(), kuCoinPrice.toString(), coinbenePrice.toString(), average.toString(), finalPrice.toString());
    }

    return {
        fetchPrice
    };

};

module.exports = price;