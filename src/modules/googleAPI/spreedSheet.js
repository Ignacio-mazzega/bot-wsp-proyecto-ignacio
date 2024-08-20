import { google } from 'googleapis';
import key from '../../../credentials-google.json' assert { type: 'json' };

const idSpreedSheets = "1M3VHU9P_vTzigyxfHrp-Aqaj1Fu4JJKK4AJEewO3Iq8"

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreedsheets']
})

const sheets = google.sheets({ version: "v4", auth: auth })

export const getData = async () => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: idSpreedSheets,
            range: "Hoja 1!A1:E20"
        })

        const disponibles = response.data.values.filter(turno => turno[2] === "Si")

        console.log(disponibles) 
    } catch (e) {
        console.log(e)
    }
}

getData()