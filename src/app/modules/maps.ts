export class Maps {

    numberMonthToStringMonth = new Map([
        ["01", "Enero"],
        ["02", "Febrero"],
        ["03", "Marzo"],
        ["04", "Abril"],
        ["05", "Mayo"],
        ["06", "Junio"],
        ["07", "Julio"],
        ["08", "Agosto"],
        ["09", "Septiembre"],
        ["10", "Octubre"],
        ["11", "Noviembre"],
        ["12", "Diciembre"]
    ])

    routineTypeToRoutine = new Map([
        ["1", "Piernas"],
        ["2", "Glúteos"],
        ["3", "Flexibilidad"],
        ["4", "Abdominales"],
        ["5", "Brazos"]
    ])

    routineToBgColor = new Map([
        ["Flexibilidad", "#d449ff"],
        ["Glúteos", "#ffa749"],
        ["Piernas", "#49a9ff"],
        ["Abdominales", "#fc6666"],
        ["Brazos", "#34b852"]
    ])

    weekdayToIndexArray = new Map([
        ["Lunes", 0],
        ["Martes", 1],
        ["Miércoles", 2],
        ["Jueves", 3],
        ["Viernes", 4],
        ["Sábado", 5],
        ["Domingo", 6],
    ])
    
}