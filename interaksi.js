const { DispatchHandler } = require("./dispatchHandler")


module.exports.op = {
    [10]: function (data, shard, client) {
        shard.kirim(
            {
                "op": 1,
                "d": data.d.heartbeat_interval
            })
    },
    [11]: function (data, shard, client) {
        shard.kirim(
            {
                "op": 2,
                "d": {
                    token: client.token,
                    intents: 516,
                    shard: [shard.shard_id, client.shards.length],
                    properties: {
                        "$os": "linux",
                        "$browser": "Discord iOS",
                        "$device": "discord.gblk"
                    }
                }
            })
    },
    [0]: function (data, shard, client) {
        // ready
        DispatchHandler.raw(data, shard, client)
    },
    [9]: function (data, shard, client) {
        //reconnect dri awal, buat session baru karna udh invalid
        client.hapus(false)
        client.login()
    }
}