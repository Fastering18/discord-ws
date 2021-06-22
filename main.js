const ws = require("ws");
const EventEmitter = require('events');
const fs = require("fs");
const { inspect } = require("util");
const interaksi = require("./interaksi")
const fetch = require("./fetch")
const { User } = require("./ClassData/MainData")
const { Koleksi, KoleksiChannel, KoleksiPengguna, KoleksiServer } = require("./ClassData/Koleksi")

var skipOP = [10, 11]
const staticLink = {
  utama: "https://discord.com/api/v9/gateway/bot"
}

class logging {
  constructor(opsi = {}) {
    this.nama = opsi.nama || "logging";
    this.aktif = opsi.aktif != undefined ? opsi.aktif : true;
    this.namafile = typeof opsi.file == "string" ? opsi.file : "./log"
  }

  liatlog(mulai = 0, akhir = -1) {
    const teksarr = fs.readFileSync(this.namafile).toString();
    return this.parse(teksarr, mulai, akhir).join("\n");
  }

  parse(data, mulai = 0, akhir = -1) {
    return data.split(/\r?\n/).slice(mulai + 1, akhir < 0 ? data.length - 1 : akhir);
  }

  masuklog(teks) {
    if (!this.aktif) return;
    return new Promise((trima, tolak) => {
      fs.readFile(this.namafile, (err, data) => {
        if (err) return trima(err);
        fs.writeFile(this.namafile, `${data.toString()}\n${typeof teks == "string" ? teks : inspect(teks)}`, (err, data) => {
          if (err) return trima(err);
          trima(true);
        })
      })
    })
  }
}

class shard extends ws {
  constructor(url, shardid, client, opsi = {}, ...argumen) {
    super(url, ...argumen)
    this.shard_id = shardid
    Object.defineProperty(this, "client", {
      enumerable: false,
      value: client,
      writable: false
    })
    if (opsi.sessionID) {
      this.session_id = opsi.sessionID
    }

    //this.once("open", () => console.log(this.client.jumlahResume > 0 ? `anjay ke resume: ${this.client.jumlahResume}` : "anjay konek", this.shard_id))
    this.on("message", (d) => {
      var jsondata = this.client.prosesData(d);
      if (opsi.sessionID && skipOP.includes(jsondata.op)) return;
      this.client.interaksi(jsondata, this)
    })
    this.on("close", () => {
      this.client.resume(this)
    })
    this.on("error", (e) => {
      this.client.log.masuklog(e)
      this.client.emit("error", e)
    })
  }
  
  get pingkoneksi() {
    return this._ping
  }
  
  get terhubung() {
    return this._readyState == ws.OPEN;
  }

  kirim(data, tipe = "json") {
    return this.send(tipe == "json" ? JSON.stringify(data) : data)
  }

  hapus() {
    this.removeAllListeners();
    this.close();
    this.terminate();
    this.client.shards.splice(this.shard_id, 1);
  }
}

/**
 * discord-ws Client class berisi websocket dan cache
 * @param {object} opsi - Object options
 * @param {string} [opsi.token=""] - Client token untuk login discord session
 * @param {number} [opsi.versiGateway=9] - Versi discord gateway untuk interaksi
 * @param {boolean} [opsi.debug=false] - Debugging events, dan error
 * @param {string} [opsi.debugFile=log] - Nama file untuk output debug
 * @returns {Client} Client objek
 */
class Client extends EventEmitter {
  constructor(opsi = {}) {
    super()
    this.shards = [];
    Object.defineProperty(
      this,
      "token",
      { enumerable: false, writable: true, value: opsi.token }
    )
    Object.defineProperty(
      this,
      "log",
      { enumerable: false, writable: false, value: new logging({ aktif: opsi.debug, nama: "discord-bot", file: opsi.debugFile }) }
    )
    Object.defineProperty(
      this,
      "_versi_gateway",
      { enumerable: false, writable: false, value: opsi.versiGateway || 9 }
    )
    Object.defineProperty(
      this,
      "jumlahResume",
      { enumerable: false, writable: true, value: 0 }
    )

    this.user = null;

    this.users = new KoleksiPengguna([], { tipe: "users", client: this });
    this.guilds = new KoleksiServer([], { tipe: "guilds", client: this });
    this.channels = new KoleksiChannel([], { tipe: "channels", client: this });
  }
 
  get ping() {
    // mean
    return this.shards.reduce((a,b)=> a.pingkoneksi + b.pingkoneksi, 0) / this.shards.length
  }

  login(token) {
    if (typeof (token) == "string") this.token = token;
    const nshard = new shard(`wss://gateway.discord.gg/?v=${this._versi_gateway}&encoding=json`, this.shards.length, this);

    this.shards.push(nshard)
  }

  resume(shardlama) {
    const shardlamaID = shardlama.shard_id, sessionID = shardlama.session_id;
    this.shards.splice(shardlamaID, 1);
    const nshard = new shard(`wss://gateway.discord.gg/?v=${this._versi_gateway}&encoding=json`, this.shards.length, this, { sessionID })

    this.jumlahResume++

    nshard.once("open", () => {
      nshard.kirim({
        "op": 6,
        "d": {
          "token": this.token,
          "session_id": sessionID,
          "seq": 1337
        }
      })
    })
    this.shards[shardlamaID] = nshard;
  }

  buatData(tipe, data, ...tambahan) {
    return new tipe(data, this, ...tambahan)
  }

  prosesData(data) {
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }

  interaksi(data, shard) {
    const op = data.op

    const metode = interaksi.op[op]
    if (!metode) throw new TypeError(`ga ada handler op ${op}`);

    return metode(data, shard, this)
  }

  ready(data, pertama) {
    Object.defineProperty(
      this,
      "_rawdata",
      { enumerable: false, writable: true, value: data }
    )
    if (pertama) {
      this.apiRequest(staticLink.utama, "get", {
        headers: {
          "content-type": "application/json"
        }
      }).then(async data => {
        Object.defineProperty(
          this,
          "_session_start_limit",
          { enumerable: false, writable: true, value: data.session_start_limit }
        )
      })
      this.user = new User(this._rawdata.d.user, this);

      this.emit("aktif", this);
    }
  }

  apiRequest(rute, metode, opsi = {}) {
    if (!opsi.headers) opsi.headers = {};
    opsi.headers.Authorization = `Bot ${this.token}`;
    opsi.headers["content-type"] = "application/json";
    return new fetch(rute, opsi)[metode]()
  }

  updateGuilds() {
    const guildsArray = this._rawdata.d.guilds;
    for (var i = 0; i < guildsArray.length; i++) {
      var shard = this.shards.find(s => s.terhubung);
      var _rawguild = guildsArray[i];
      shard.kirim({
        "op": 8,
        "d": {
          "guild_id": _rawguild.id,
          "query": "",
          "limit": 0
        }
      })
    }
  }

  /* metode */
  updateStatus(status, tipe, teks, opsi = {}) {
    var shard = this.shards.find(s => s.terhubung)

    shard.kirim({
      "op": 3,
      "d": {
        "since": Date.now(),
        "activities": [{
          "name": teks,
          "type": tipe
        }],
        "status": tipe,
        "afk": opsi.afk || false
      }
    })
  }

  reset() {
    this.user = null;
    this._rawdata = null;
    this._session_start_limit = null;
    this.jumlahResume = 0;
    this.users = new Map();
    this.channels = new Map();
    this.guilds = new Map();
    this.shards = [];
  }

  hapusShard(id) {
    this.shards[id].hapus();
    return this;
  }
  
  hapus(reset = true) {
    this.shards.forEach(s => s.hapus())
    if (reset) {
      this.removeAllListeners();
      this.reset();
    }

    return this;
  }

  kirim(shard, data, op) {
    if (op) data.op = op;
    return shard.kirim(data)
  }
}


module.exports = {
  Client,
  Koleksi,
  fetch
}
