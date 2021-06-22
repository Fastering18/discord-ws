const DispatchHandler = {};
const { BaseMessage } = require("./ClassData/MainData");

const sebuahMessage = (obj) => {
    return (["MESSAGE_CREATE", "MESSAGE_UPDATE"]).includes(obj.t);
}

DispatchHandler.raw = async function (data, shard, client) {
    const metode = DispatchHandler[data.t]
    client.log.masuklog(`[${data.t}]:  ${new Date().toLocaleString()}`);
    if (!metode) {
        return client.log.masuklog(new TypeError(`dispatch metode ga ada: ${data.t}`))
    }
    return metode(data, shard, client);
}

DispatchHandler["READY"] = async function (data, shard, client) {
    shard.session_id = data.d.session_id;
    client.ready(data, client.jumlahResume == 0)
}
DispatchHandler["RESUMED"] = async function (data, shard, client) {

}
DispatchHandler["MESSAGE_CREATE"] = async function (data, shard, client) {
    const pengirim = client.users.get(data.d.author.id) || await client.users.fetch(data.d.author.id);
    const guildobj = client.guilds.get(data.d.guild_id) || await client.guilds.fetch(data.d.guild_id);
    const channelobj = client.channels.get(data.d.channel_id) || await client.channels.fetch(data.d.channel_id);
    const message = new BaseMessage({ msgObjek: data.d, channelobj, guildobj, pengirim }, client);
    client.emit("message", message)
}
DispatchHandler["MESSAGE_UPDATE"] = async function (data, shard, client) {
    const pengirim = client.users.get(data.d.author.id) || await client.users.fetch(data.d.author.id);
    const channelobj = client.channels.get(data.d.channel_id) || await client.channels.fetch(data.d.channel_id);

    const message = new BaseMessage({ msgObjek: data.d, channelobj, pengirim }, client);
    client.emit("messageDiEdit", message)
}

module.exports = {
    DispatchHandler
}