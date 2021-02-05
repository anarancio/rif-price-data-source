require('dotenv').config()

const minSatoshi = process.env.MIN_SATOSHI

const health = () => {

    const status = () => {
        return {
            minimumPrice: minSatoshi,
            lastReturnedPrice: global.pricing,
            lastReturnedTimestamp: global.ts,
        }
    }

    return {
        status
    };
    
};

module.exports = health;