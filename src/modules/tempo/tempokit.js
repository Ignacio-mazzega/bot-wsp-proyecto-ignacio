import { format } from "@formkit/tempo";

export function fechaActual() {
    const date = new Date();

    const fecha = format(date, "short");
    const hora = format(date, "HH:mm");

    return {fecha, hora, complete: `${fecha} ${hora}`}
}

console.log(fechaActual());