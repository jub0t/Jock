export function generateIR(name: string, typen: string, value: any) {
    return `${name}<${typen}> = ${value}`
}