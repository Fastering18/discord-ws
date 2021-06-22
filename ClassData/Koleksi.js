const tipeData = require('./MainData');
const enums = require("../enums")
const { inspect } = require("util")

class Koleksi extends Map {
    constructor(isi, opt) {
        super(isi || []);
        this.fetchLinkTipe = opt.tipe;
        Object.defineProperty(this, '_client', {
            enumerable: false,
            writable: false,
            value: opt.client
        });
    }

    get client() {
        return this._client;
    }

    get pertama() {
        return this.jadiArray()[0];
    }
    get akhir() {
        var ar = this.jadiArray();
        return ar[ar.length - 1];
    }

    jadiArray() {
        return Array.from(this.values());
    }

    cari(fn = () => { }) {
        return this.jadiArray().find(fn);
    }

    map(fn = () => { }) {
        return this.jadiArray().map(fn);
    }

    fetch(id, tipe = 0) {
        return new Promise((trima, tolak) => {
            this.client
                .apiRequest(
                    `https://discord.com/api/v9/${this.fetchLinkTipe}/${id}`,
                    'get'
                )
                .then(hasil => {
                    if (!hasil) return;
                    const dataclass = this.client.buatData(this.fetchLinkTipe == 'channels'
                        ? tipe == 0
                            ? tipeData.TeksChannel
                            : tipeData.DirektoriChannel
                        : tipeData.User,
                        hasil
                    )
                    if (!hasil.id) return;
                    this.set(
                        id.toString(),
                        dataclass
                    );
                    return trima(dataclass);
                })
                .catch(tolak);
        });
    }
}

class KoleksiChannel extends Koleksi {
    fetch(id, tipe = 0) {
        return new Promise((trima, tolak) => {
            this.client
                .apiRequest(
                    `https://discord.com/api/v9/channels/${id}`,
                    'get'
                )
                .then(async hasil => {
                    if (!hasil || !hasil.id) return tolak(hasil);
                    const dataclass = this.client.buatData(tipeData[enums.channelTipe[hasil.type]], hasil);
                    if (hasil.parent_id) {
                        try {
                            dataclass.direktori = await this.fetch(hasil.parent_id);
                        } catch (err) {
                            this.client.log.masuklog(inspect(err))
                        }
                    }
                    this.set(
                        id.toString(),
                        dataclass
                    );
                    return trima(dataclass)
                })
                .catch(tolak)
        })
    }
}

class KoleksiPengguna extends Koleksi {
    fetch(id, tipe = 0) {
        return new Promise((trima, tolak) => {
            this.client
                .apiRequest(
                    `https://discord.com/api/v9/users/${id}`,
                    'get'
                )
                .then(async hasil => {
                    if (!hasil || !hasil.id) return tolak(hasil);
                    const dataclass = this.client.buatData(tipeData["User"], hasil);

                    this.set(
                        id.toString(),
                        dataclass
                    );
                    return trima(dataclass)
                })
                .catch(tolak)
        })
    }
}

class KoleksiEmoji extends Koleksi {

}

class KoleksiServer extends Koleksi {
    fetch(id, tipe = 0) {
        return new Promise((trima, tolak) => {
            this.client
                .apiRequest(
                    `https://discord.com/api/v9/guilds/${id}`,
                    'get'
                )
                .then(async hasil => {
                    if (!hasil || !hasil.id) return tolak(hasil);
                    const dataclass = this.client.buatData(tipeData["BaseGuild"], hasil, { KoleksiEmoji });

                    this.set(
                        id.toString(),
                        dataclass
                    );
                    return trima(dataclass)
                })
                .catch(tolak)
        })
    }
}

module.exports = {
    Koleksi,
    KoleksiChannel,
    KoleksiPengguna,
    KoleksiEmoji,
    KoleksiServer

};
