const { Member } = require("./UserData");
//const { TeksChannel } = require("./Channel")

class mentions {
    constructor(d, client) {
        this.users = d.mentions;
        this.roles = d.roles;
        this.everyone = d.epriawan;
    }

    cari(fn) {
        return
    }
}

class BaseMessage extends String {
    constructor({ msgObjek, channelobj, guildobj, msgPengirim }, client) {
        super(msgObjek.content);
        this.konten = msgObjek.content;
        this.tts = msgObjek.tts; //text-to-speech
        this.dibuatSaat = new Date(msgObjek.timestamp);
        this.pin = msgObjek.pinned;
        this.mentions = new mentions({
            mentions: msgObjek.mentions,
            roles: msgObjek.mention_roles,
            epriawan: msgObjek.mention_everyone
        }, client);
        this.member = new Member({ msgObjek, msgPengirim }, client);
        this.pengirim = this.member.user;
        this.channel = channelobj;
        this.balasan = msgObjek.referenced_message;
        this.guild = guildobj;
        this.member.guild = this.guild;
    }

    toString() {
        return this.konten
    }
}




module.exports = {
    BaseMessage
}