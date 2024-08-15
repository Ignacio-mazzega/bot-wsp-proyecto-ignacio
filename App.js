import wweb from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cron from "node-cron";
import {data} from "./data.js";
import { getChar } from "./src/modules/rickAndMorty/getCharacter.js";

const dt = JSON.parse(JSON.stringify(data));
const {Client, LocalAuth, MessageMedia, Poll} = wweb;


/* 
    Bienvenida - consultamos que quiere hacer?
                - lista de horarios disponibles
                - Reservar turno:
                    - Que fecha - hora?? - true :  
                                - Perfecto está disponible, necesito los siguientes datos: nombre, hora, cuantos jugadores? de la siguiente forma:
                                - nombre  - jugadores
                                



*/

const state = {
    fecha: false,
}

const turnos = [
    { fecha: "", cliente: "", hora: "", cancha: "", localidad: "", pagado: false, jugadores: [], idTurno: "" }
]

const fechas = [
    { fecha: "14/08", hora: "10:45", disponible: true },
    { fecha: "14/08", hora: "11:45", disponible: true },
    { fecha: "15/08", hora: "10:45", disponible: false },
    { fecha: "15/08", hora: "11:45", disponible: true },
    { fecha: "16/08", hora: "10:45", disponible: true },
    { fecha: "16/08", hora: "11:45", disponible: true },
    { fecha: "17/08", hora: "10:45", disponible: false },
    { fecha: "17/08", hora: "11:45", disponible: true },
    { fecha: "18/08", hora: "10:45", disponible: false },
    { fecha: "18/08", hora: "11:45", disponible: true }
]


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

    if (msj === "horarios") {
        // const {name, status, image} = await getChar(msj)
        // const img = MessageMedia.fromUrl(image)
        // await bot.sendMessage(from, img, {caption: `Personaje: ${name} - *${status}*`})
        const fechasDisponibles = fechas.filter(fechas => fechas.disponible)
        await bot.sendMessage(from, `${fechasDisponibles.map(fecha => fecha.fecha + " - " + fecha.hora + " | está disponible")}`);
        await bot.sendMessage(from, "Para reservar, dinos fecha y hora de esta forma: 12/12 - 10:45")
        return
    }

    if (msj.split('-').length === 2) {
        const reserva = msj.split('-')
        const fechaR = reserva[0].trim()
        const horario = reserva[1].trim()

        const enable = fechas.find(fecha => fecha.disponible && fecha.fecha === fechaR && fecha.hora === horario)

        if (enable) {
            turnos.push({ fecha: fechaR, cliente: "", hora: horario, cancha: "", localidad: "", pagado: false, jugadores: [], idTurno: "" })
            const newList = fechas.map(fecha => {
                if (fecha.fecha === fechaR && fecha.hora === horario) {
                    fecha.disponible = false
                }
                return fecha
            })
            
            fechas = newList
            await message.reply(`Genial, reservando para la fecha ${fechaR} en el horario ${horario}, dime nombre y cantidad de jugadores de esta forma: Nombre/Cantidad`)
            
        } else {
            await message.reply('Disculpa o la fecha ya está reservada o me pasaste el dato mal')
        }
    }
    
    if (msj.split('/').length === 2) {
        const res = msj.split('/')
        const nombreReserva = res[0].trim()
        const cantidad = res[1].trim()

        const final = fechas.find(final => final.cliente && final.jugadores === nombreReserva && final.jugadores === cantidad)
    }

    /* if (msj.includes("/locacion/")) {
        const {type, residents} = await getChar(msj)
        const img = MessageMedia.fromUrl(image)
        await bot.sendMessage(from, img, {caption: `Personaje: ${type} - *${residents}*`})
    } */
    
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


/* cron.schedule('5,10,15,20,25,30 * * * * *', async () => {
    const media = MessageMedia.fromFilePath('./src/assets/images/kawaii.jpg');

  await bot.sendMessage(`548${data.numbers.me}@c.us`, "Molestando")
  await bot.sendMessage(`548${data.numbers.me}@c.us`, media, {sendMediaAsSticker: true})
}); */

bot.initialize();