import { readFile } from "fs/promises";
import { Unit } from "src/units/entities/unit.entity";

export async function getUnits() {
    const data = (JSON.parse(await readFile('local_data/units.json', 'utf-8') || '[]'));
    const units: Unit[] = data.map(item => {
        return {
            ...item,
            name: toTitleCase(item.name),
            createdAt: new Date(),   
        }
    });
    return units;
}

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}