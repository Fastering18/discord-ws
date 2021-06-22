const { Client } = require("./main");
// pakai .env untuk menyimpan data penting ke lokal

const client = new Client();
client.prefix = "^";
client.owners = ["775363892167573535","646346146553397258"];

client.on("error", (e) => console.log("WSError:", e.toString()))
client.on("aktif", async (c) => {
  console.log(client.user.username, "online :v")
  client.updateStatus("dnd", 5, "discord.gblk")
})

const messageHandler = async (message) => {
  if (message.pengirim.id == client.user.id || message.pengirim.bot || !message.konten.startsWith(client.prefix)) return;
  const args = message.konten
    .slice(client.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "run") {
    const script = args.join(" ");
    if (!script) return message.channel.kirim("**`^run <script>`** untuk run command.");
    const { hasil, error } = gblk.executeSync(script, message.member.nickname + ".gblk")
    if (error) message.channel.kirim(error.toString());
    message.channel.kirim("berhasil, output di log.")
  } else if (command == "eval") {
    if (!client.owners.includes(message.pengirim.id)) return message.channel.kirim("BAKAAAasadasdasz, anata wa bukan owner!");
    try {
      const hasil = eval(args.join(" "));
      message.channel.kirim("```xl\n" + (typeof hasil == "string" ? hasil : inspect(hasil)).substring(0, 1970) + "\n```");
    } catch (err) {
      message.channel.kirim(err.toString())
    }
  }
}

client.on("message", messageHandler)
client.on("messageDiEdit", messageHandler)

client.login("NzkzMTA4ODg3OTM4OTI0NTQ0.X-neNg.JMroRdWu4A8vhsIIQ9UagJdEl2M")