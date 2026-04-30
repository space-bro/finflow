export interface Category {
    readonly id: string;
    name: string;
    icon: string;
    color: string;
    readonly createdAt: Date;
    isDefault: boolean;
}

export function createCategory(id: string, name: string, icon: string, color: string, isDefault: boolean): Category {
    return {
        id: id ||crypto.randomUUID(),
        name: name,
        icon: icon,
        color: color,
        createdAt: new Date(),
        isDefault: isDefault
    }
}