//const { KoleksiEmoji } = require("./Koleksi")

class Emoji {
    constructor(obj, client) {
        this.nama = obj.name;
        this.id = obj.id;
        this.pakaiKolon = obj.require_colons;
        this.roles = obj.roles;
        this.managed = obj.managed;
        this.animated = obj.animated;
        this.tersedia = obj.available;
    }

    get imageURL() {
        return `https://cdn.discordapp.com/emojis/${this.id}`
    }

    toString() {
        return `<${this.animated ? "a" : ""}:${this.nama}:${this.id}>`
    }
}

class BaseGuild {
    constructor(obj, client, { KoleksiEmoji }) {
        this.id = obj.id;
        this.nama = obj.name;
        this.ikon = obj.icon;
        this.deksripsi = obj.description;
        this.splash = obj.splash;
        this.discoverySplash = obj.discovery_splash;
        this.approximateMemberCount = obj.approximate_member_count;
        this.approximatePresenceCount = obj.approximate_presence_count;
        this.fitur = obj.features;
        this.emojis = new KoleksiEmoji(obj.emojis.map(e => [e.id, new Emoji(e)]), { client, tipe: "emojis" });
        this.banner = obj.banner;
        this.pemilikID = obj.owner_id;
        this.applicationID = obj.application_id;
        this.daerah = obj.region;
        this.afkChannelID = obj.afk_channel_id;
        this.afkTimeout = obj.afk_timeout;
        this.systemChannelID = obj.system_channel_id;
        this.widgetAktif = obj.widget_enabled;
        this.widgetChannelID = obj.widget_channel_id;
        this.levelVerifikasi = obj.verification_level;
        this.roles = obj.roles;
        this.defaultPesanNotifikasi = obj.default_message_notifications;
        this.mfaLevel = obj.mfa_level;
        this.filterKontenEksplisit = obj.explicit_content_filter;
        this.maxPresences = obj.max_presences;
        this.maxMembers = obj.max_members;
        this.maxPenggunaVideoChannel = obj.max_video_channel_users;
        this.vanityKodeURL = obj.vanity_url_code;
        this.tingkatBoost = obj.premium_tier;
        this.jumlahSubscriptionPremium = obj.premium_subscription_count;
        this.systemChannelFlags = obj.system_channel_flags;
        this.pilihanLokal = obj.preferred_locale;
        this.aturanChannelID = obj.rules_channel_id;
        this.publikPembaharuanChannelID = obj.public_updates_channel_id;
    }
}


module.exports = {
    BaseGuild,
    Emoji
}