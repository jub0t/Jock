import { InstanceType } from "./types";

export function generateIR(name: string, typen: InstanceType, value: any) {
    return `${name}<${typen}> = ${value}`
}