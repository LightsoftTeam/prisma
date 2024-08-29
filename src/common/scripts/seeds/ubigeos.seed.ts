import { readFile } from "fs/promises";
import { Ubigeo } from "src/domain/entities/ubigeo.entity";
import { v4 as uuidv4 } from 'uuid';

export async function getUbigeos() {
    const data = (JSON.parse(await readFile('local_data/ubigeos.json', 'utf-8') || '[]')).map(d => ({...d, id: uuidv4()}));
    const ubigeos: Ubigeo[] = data.map(item => {
        const parentCode = data.find(d => d.id_ubigeo === item.id_padre_ubigeo)?.id ?? undefined; 
        const {id, nombre_ubigeo: name, codigo_ubigeo: code, etiqueta_ubigeo: label, numero_hijos_ubigeo: childrenCount, nivel_ubigeo: level } = item;
        return {
            id,
            name,
            code,
            label,
            level: Number(level),
            childrenCount: Number(childrenCount),
            parentCode
        }
    });
    return ubigeos;
}