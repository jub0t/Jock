import GetType, { InstanceType, IsBasic } from "../tools/types";
import { getAllClassChildren } from "../tools/classes";
import getFunctionInfo from "../tools/functions";

export interface AnyMap {
    [key: string]: any
}

export interface FunctionData {
    RawCode: string
    Params: string[]
}

export interface ClassData {
    RawCode: string
    Params: string[]
}

export interface Export<T> {
    Key: String
    Type: InstanceType
    IsBasic: boolean
    Value: undefined | T
    Children: Export<T>[]
    ClassData?: ClassData
    FunctionData?: FunctionData
}

class Parser {
    // Data
    #data: Export<any>[] = [];
    #ir: String[] = []

    // Parse object
    public parse(object: AnyMap, verbose: boolean = false) {
        const instances = Object.keys(object)

        for (let x = 0; x < instances.length; x++) {
            const key = instances[x];
            const value = object[key]
            const itype = GetType(value)
            const is_basic = IsBasic(itype)

            let final: Export<typeof itype> = {
                Key: key,
                Type: itype,
                Value: value,
                IsBasic: is_basic,
                Children: [],
            }

            if (itype == InstanceType.Class) {
                const class_children = getAllClassChildren(value)
                final.Children = [...final.Children, ...class_children]
                final.ClassData = getFunctionInfo(value)
            }
            else if (itype == InstanceType.Function) {
                final.FunctionData = getFunctionInfo(value)
            }
            else if (itype == InstanceType.Object) {
                let innerObject = this.parse(value)
                final.Children = innerObject
            }

            this.#data.push(final as unknown as Export<typeof itype>)
        }

        return this.#data
    }
}

const LocalParser = new Parser();

export { LocalParser }
export default Parser;