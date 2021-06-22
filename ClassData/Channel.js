class BaseChannel {
    constructor(obj, client) {
        this.id = obj.id;
        this.tipeChannel = "unknown";
        Object.defineProperty(
            this,
            "_client",
            { enumerable: false, writable: false, value: client }
        )
        this.posisi = obj.position;
        this.nama = obj.name;
        this.direktori = null;
        if (obj.parent_id) this.direktoriID = obj.parent_id;
    }

    get client() {
        return this._client
    }

    get _channelLink() {
        return `https://discord.com/api/v9/channels/${this.id}`
    }

    toString() {
        return `<#${this.id}>`
    }
}

class TeksChannel extends BaseChannel {
    constructor(obj, client) {
        super(obj, client)
        this.tipeChannel = "teks"
        this.nsfw = obj.nsfw
        this.topik = obj.topic
        this.permission_overwrites = obj.permission_overwrites;
        this.pesanTerakhirID = obj.last_message_id;
        this.waktuPinTerakhir = new Date(obj.last_pin_timestamp);
    }

    kirim(teks, ...lain) {
        const link = this._channelLink + "/messages";
        const data = typeof teks == "string" ? {
            content: teks,
            ...lain
        } : teks;

        return new Promise((trima, tolak) => {
            this.client.apiRequest(link, "post", {
                body: JSON.stringify(data)
            }).then(r => {
                trima(r)
            }).catch(err => {
                this.client.log.masuklog(err.toString())
                tolak(err)
            })
        })
    }
}

class DirektoriChannel extends BaseChannel {
    constructor(obj, client) {
        super(obj, client)
        this.tipeChannel = "direktori"
        this.nsfw = obj.nsfw
    }


}


module.exports = {
    DirektoriChannel,
    TeksChannel,

}