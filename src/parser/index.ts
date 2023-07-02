import { getAllClassChildren } from "../tools/children";
import GetType, { InstanceType, IsBasic } from "../tools/types";

export interface AnyMap {
    [key: string]: any
}

export interface Export {
    Key: String
    Type: InstanceType
    Children: Export[]
    Value: undefined | any
    IsBasic: boolean // Basic types like Number, String, Boolean, etc.
}

class Parser {
    // Data
    #data: Export[] = [];
    #ir: String[] = []

    // Parse object
    public parse(object: AnyMap, verbose: boolean) {
        const instances = Object.keys(object)

        for (let x = 0; x < instances.length; x++) {
            const key = instances[x];
            const value = object[key]
            const itype = GetType(value)
            const is_basic = IsBasic(itype)
            let children: any[] = []

            if (itype == InstanceType.Class) {
                const class_children = getAllClassChildren(value)
                children = [...children, ...class_children]
            }

            this.#data.push({
                Key: key,
                Type: itype,
                Value: value,
                IsBasic: is_basic,
                Children: children,
            } as Export)
            this.#ir.push(`${key}<${itype}> = ${value}`)
        }

        if (verbose) console.log(this.#ir.join("\n--------- CUT ---------\n"))
        return this.#data
    }
}

export default Parser;