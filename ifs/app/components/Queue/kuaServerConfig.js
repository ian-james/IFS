module.exports.testKue = {
    kueOpts:{
        redis: { 
            port: 6379,
            host: "127.0.0.1",
        }
    },
    options: {
        watchStuckTime: 60*1000
    },
    ui: {
        title: "Tool Server UI",
        port: 4000
    }
};