module.exports.testKue = {
    kueOpts:{
        redis: { 
            port: 6379,
            host: "redis_cache",
        }
    },
    options: {
        watchStuckTime: 10*1000
    },
    ui: {
        title: "Tool Server UI",
        port: 4000
    },
    ttl: 260
};
