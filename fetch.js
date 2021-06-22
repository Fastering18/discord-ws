const https = require("https");
const http = require("http");
const userAgent = "DiscordBot (https://gblklang.glitch.me/libs/discordgblk, 0.0.1)"

function cobaParse(json) {
    try {
        return JSON.parse(json)
    } catch (e) {
        return json
    }
}

class request {
    constructor(url, options) {
        options = typeof options == "object" ? options : {};
        url = new URL(url);
        options.host = typeof options.host == "string" ? options.host : url.host;
        options.port = (options.port ? options.port : url.port) || "443";
        options.path = options.path ? options.path : url.pathname;
        options.method = options.method ? options.method : "GET";
        options.headers = typeof options.headers == "object" ? options.headers : {}
        options.headers["user-agent"] = userAgent

        this.options = options
        this.url = url
    }

    esekusi() {
        return new Promise((trima, tolak) => {
            const req = (this.url.portocol == "http:" ? http : https).request(this.url.href, this.options, (res) => {
                res.setEncoding('utf8');
                var body = '';
                res.on('data', (data) => {
                    body += data;
                });
                res.on('end', () => {
                    return trima(this.options.headers["content-type"] == "application/json" ? cobaParse(body) : body)
                });
                res.on('error', (e) => {
                    return tolak(e)
                })
            });

            req.on('error', (err) => {
                return tolak(err);
            });
            req.end(this.options.body || "");
        });
    }

    json() {
        this.options.headers["content-type"] = "application/json"
        return this
    }

    get() {
        this.options.method = "GET";
        return this.esekusi()
    }

    post() {
        this.options.method = "POST";
        return this.esekusi()
    }

    put() {
        this.options.method = "PUT";
        return this.esekusi()
    }

    patch() {
        this.options.method = "PATCH";
        return this.esekusi()
    }

    delete() {
        this.options.method = "DELETE";
        return this.esekusi()
    }
}

function get(url, options) {
    return new request(url, options).get()
}

function post(url, options) {
    return new request(url, options).post()
}


request.get = get;
request.post = post;

module.exports = request;