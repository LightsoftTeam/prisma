import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import { getEnterprises } from './seeds/enterprises.seed';
import { Ubigeo } from '../../domain/entities/ubigeo.entity';
import { getUbigeos } from './seeds/ubigeos.seed';
import { getUnits } from './seeds/units.seed';
import { getRoles } from './seeds/roles.seed';
dotenv.config();

export enum ContainerNames{
    ENTERPRISES = 'enterprises',
    DEPARTMENTS = 'departments',
    PROVINCES = 'provinces',
    DISTRICTS = 'districts',
    PEOPLE = 'people',
    ROLES = 'roles',
    UBIGEOS = 'ubigeos',
    UNITS = 'units',
}

export async function main() {
    const client = new CosmosClient({
        endpoint: process.env.DB_ENDPOINT,
        key: process.env.DB_KEY,
    });
    const database = client.database(process.env.DB_NAME);
    // const enterprises = getEnterprises();
    // const enterprisesContainer = database.container(ContainerNames.ENTERPRISES);
    // for (const enterprise of enterprises) {
    //     await enterprisesContainer.items.create(enterprise);
    // }
    // const ubigeos: Ubigeo[] = await getUbigeos();
    // const ubigeosContainer = database.container(ContainerNames.UBIGEOS);
    // for (const ubigeo of ubigeos) {
    //     await ubigeosContainer.items.create(ubigeo);
    // }
    // const unitsContainer = database.container(ContainerNames.UNITS);
    // const units = await getUnits();
    // for (const unit of units) {
    //     await unitsContainer.items.create(unit);
    // }
    const rolesContainer = database.container(ContainerNames.ROLES);
    const roles = getRoles();
    for (const role of roles) {
        await rolesContainer.items.create(role);
    }
}

// async function getUbigeos(){
//     const departments = await fetch("https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/departamentos.json").then(res => res.json());
//     const provinces = await fetch("https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/provincias.json").then(res => res.json());
//     const districts = await fetch("https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/distritos.json").then(res => res.json());
//     const ubigeos = [
//         ...departments,
//         ...Object.values(provinces).flat(),
//         ...Object.values(districts).flat()
//     ]
//     // writeFile('local_data/ubigeos.json', JSON.stringify(ubigeos, null, 2));
//     const nivels = ubigeos.map(u => u.id_ubigeo);
//     const distintcsNivels = [...new Set(nivels)];
//     console.log(distintcsNivels);
// }

main();
// getUbigeos();