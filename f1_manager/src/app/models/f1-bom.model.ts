export interface Component {
    _id?: string;
    partNumber: string;
    serialNumber?: string;
    name: string;
    type: 'Part' | 'Assembly' | 'System';
    category: string;
    isStandardPart: boolean;
    version?: string;
    specifications?: {
        dimensions?: string;
        material?: string;
        weight_g?: number;
        torque_nm?: number;
    };
    subComponents?: {
        componentId: string | Component;
        serialNumber?: string;
        quantity: number;
    }[];
}

export interface Asset {
    _id?: string;
    serialNumber?: string;
    batchNumber?: string;
    componentId: string | Component;
    status: string;
    quantity: number;
    parentAssetId?: string;
    rootAssetId?: string;
}

export interface Car {
    _id?: string;
    modelName: string;
    carNumber: number;
    driver?: string;
    chassisAssetId: string | Asset;
}
