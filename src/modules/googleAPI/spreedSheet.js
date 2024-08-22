import { google } from 'googleapis';
import key from '../../../credentials-google.json' assert { type: 'json' };
import { fechaActual } from '../tempo/tempokit.js';

const idSpreedSheets = "1M3VHU9P_vTzigyxfHrp-Aqaj1Fu4JJKK4AJEewO3Iq8"

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: "v4", auth: auth })

export const getData = async () => {
    try {

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: idSpreedSheets,
            range: "Turnos!A1:J14"
        })

        const disponibles = response.data.values.filter(turno => turno[2] === "Si")

        return disponibles.map(turno => turno.join(' - '))

    } catch (e) {
        console.log(e)
    }
}


export const setReserva = async (fecha, horario, nombre, num) => {
    try {

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: idSpreedSheets,
            range: "Turnos!A1:J14"
        })

        const id = response.data.values.findIndex(turno => turno[0].includes(fecha) && turno[1].includes(horario))
        
        const newData = response.data.values
        const date = fechaActual()
        if(id !== -1){
            newData[id][2] = "No"
            newData[id][3] = nombre
            newData[id][4] = date.fecha
            newData[id][5] = date.hora
            newData[id][6] = date.complete
            newData[id][7] = num.split('@')[0]
        }

        await sheets.spreadsheets.values.update({
            spreadsheetId: idSpreedSheets,
            range: "Turnos!A1:J14",
            valueInputOption: "RAW",
            requestBody: { values: newData }
        })
        
    } catch (e) {
        console.log(e)
    }
}
console.log(await getData());