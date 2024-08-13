import wweb from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cron from "node-cron";
import {data} from "./data.js";
import { getChar } from "./src/modules/rickAndMorty/getCharacter.js";

const dt = JSON.parse(JSON.stringify(data));
const {Client, LocalAuth, MessageMedia, Poll} = wweb;

const bot = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-sexurity', '--disable-setuid-sandbox'],
        headless: true
    },
    webVersion: '2.2409.2',
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
    }
});

bot.on('ready', async () => {
    const media = MessageMedia.fromFilePath('./src/assets/images/kawaii.jpg');
    await bot.sendMessage('5492616522775@c.us', media, { sendMediaAsSticker: true })
})

bot.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
})

bot.on('message', async message => {
    
    const from = message.from
    const msj = message.body.toLowerCase()

    if (msj.includes("/personaje/")) {
        const {name, status, image} = await getChar(msj)
        const img = MessageMedia.fromUrl(image)
        await bot.sendMessage(from, img, {caption: `Personaje: ${name} - *${status}*`})
    }

    if (msj.includes("/locacion/")) {
        const {type, residents} = await getChar(msj)
        const img = MessageMedia.fromUrl(image)
        await bot.sendMessage(from, img, {caption: `Personaje: ${type} - *${residents}*`})
    }
    
    /* switch (from) {
        case `549${data.numbers.me}@c.us`:
            const media = MessageMedia.fromFilePath('./src/assets/images/kawaii.jpg');
            await bot.sendMessage(from, media, {sendMediaAsSticker: true})

            break;
    
        default:
            await message.reply('A desconocidos no')
            break;
    } */
})


cron.schedule('5,10,15,20,25,30 * * * * *', async () => {
    const media = MessageMedia.fromFilePath('./src/assets/images/kawaii.jpg');

  await bot.sendMessage(`548${data.numbers.me}@c.us`, "Molestando")
  await bot.sendMessage(`548${data.numbers.me}@c.us`, media, {sendMediaAsSticker: true})
});

bot.initialize();