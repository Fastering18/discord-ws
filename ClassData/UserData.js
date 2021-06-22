class User extends String {
    constructor(userobjek, client) {
        super(userobjek.username);
        this.username = userobjek.username;
        this.verified = userobjek.verified;
        this.MFA_Enabled = userobjek.mfa_enabled;
        this.id = userobjek.id;
        this.discriminator = userobjek.discriminator;
        this.bot = userobjek.bot == true
        this.avatar = userobjek.avatar
    }

    get tag() {
        return `${this.username}#${this.discriminator}`
    }
    get mention() {
        return `<@${this.id}>`
    }

    avatarURL(opsi = {}) {
        if (!this.avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}${opsi.format ? `.${opsi.format}` : ""}${opsi.format ? "." + opsi.format : ""}${opsi.ukuran ? "?size=" + opsi.ukuran : ""}`
    }

    toString() {
        return `${this.username}#${this.discriminator}`
    }
}

class Member extends String {
    constructor({ msgObjek, msgPengirim }, client) {
        super(`${msgObjek.author.username}#${msgObjek.author.discriminator}`);
        this.nickname = msgObjek.member.nick;
        this.id = msgObjek.author.id;
        this.roles = msgObjek.member.roles;
        this.premiumSejak = msgObjek.member.premium_since;
        this.joinSejak = new Date(msgObjek.member.joined_at);
        this.user = new User(msgObjek.author, client)
    }

    toString() {
        return `<@${this.id}>`
    }
}

module.exports = {
    User,
    Member
}