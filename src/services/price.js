require('dotenv').config()
const axios = require('axios');
const Big = require('big.js');

const mxcUrl = process.env.MXC_URL
const mxcAPI = process.env.MXC_API_KEY
const kuCoinUrl = process.env.KUCOIN_URL
const coinbeneUrl = process.env.COINBENE_URL
const minSatoshi = process.env.MIN_SATOSHI

const price = () => {

    const fetchMxcPrice = async () => {
        const result = await axios.get(mxcUrl + mxcAPI);
        const price = result.data.data[0].last;
        return Big(price);
    }

    const fetchKuCoin = async () => {
        const result = await axios.get(kuCoinUrl);
        const price = result.data.data.price;
        return Big(price);
    }

    const fetchCoinbene = async () => {
        const result = await axios.get(coinbeneUrl);
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

        const min = Big(minSatoshi);

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