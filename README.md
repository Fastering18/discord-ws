## Unoffical Discord websocket client  

```js
const { Client } = require("discord-ws");
// pakai .env untuk menyimpan token rahasia ke lokal

const client = new Client();
client.prefix = "^";
client.owners = ["775363892167573535","646346146553397258"];

client.on("error", (e) => console.log("client error:", e.toString()))
client.on("aktif", async (c) => {
  console.log(client.user.username, "online :v")
  client.updateStatus("dnd", 5, "discord bot")
})

const messageHandler = async (message) => {
  if (message.pengirim.bot || !message.konten.startsWith(client.prefix)) return;
  const args = message.konten
    .slice(client.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "ping") {
    message.channel.kirim(`pong! ${message.member.toString()}`)
  }
}

client.on("message", messageHandler)
client.on("messageDiEdit", messageHandler)

client.login("token")
```  
  
Please read documentations from discord for understanding bots here:  
- [Bots](https://discord.com/developers/docs/intro)  
- [Guilds](https://discord.com/developers/docs/resources/guild)
- [Channels](https://discord.com/developers/docs/resources/channel)  
- [Users](https://discord.com/developers/docs/resources/user)  
<br>

### Quick documentation  

client.guilds -> Guilds[]
client.channels -> (TextChannel|DirektoriChannel)[]  
client.users -> Users[]  
  
client.on("aktif", client)  
`listen to every client connected to discord session`  
  
client.on("message", fn)   
`listen to every message received from websocket`  
  
fn(message): 
-  message.member -> Member
-  message.pengirim -> User
-  message.guild -> Guild
-  message.channel -> TextChannel

-  message.channel.kirim((string Message|object (embed|components))) -> Promise  
