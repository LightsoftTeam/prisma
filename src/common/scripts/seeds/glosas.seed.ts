import { Glosa, GlosaType } from "src/domain/entities";

export function getGlosas(){
    const glosas: Glosa[] = [
        {
            name: 'Compra de mercadería',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Devolución de productos de clientes',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Ajuste de inventario',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Venta suspendida',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Traslado entre almacenes',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Transferencia de producto',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
        {
            name: 'Producción',
            createdAt: new Date(),
            sunatCode: '01',
            type: GlosaType.INCOME,
            isInmutable: true,
        },
    ];
    return glosas;
}