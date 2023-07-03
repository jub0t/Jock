import getFunctionInfo from "../tools/functions";
import { getAllClassChildren } from "../tools/classes";
import GetType, { InstanceType, IsBasic } from "../tools/types";

export interface AnyMap {
    [key: string]: any
}

export interface FunctionData {
    RawCode: string
    Params: string[]
}

export interface Export {
    Key: String
    Type: InstanceType
    IsBasic: boolean
    Value: undefined | any
    Children: Export[]
    FunctionData?: FunctionData
}

class Parser {
    // Data
    #data: Export[] = [];
    #ir: String[] = []

    // Parse object
    public parse(object: AnyMap, verbose: boolean = false) {
        const instances = Object.keys(object)

        for (let x = 0; x < instances.length; x++) {
            const key = instances[x];
            const value = object[key]
            const itype = GetType(value)
            const is_basic = IsBasic(itype)

            let children: any[] = []
            let function_data;

            if (itype == InstanceType.Class) {
                const class_children = getAllClassChildren(value)
                children = [...children, ...class_children]
            }
            else if (itype == InstanceType.Function) {
                function_data = getFunctionInfo(value)
            }
            else if (itype == InstanceType.Object) {
                let innerObject = this.parse(value)
                children = innerObject
            }

            let final: Export = {
                Key: key,
                Type: itype,
                Value: value,
                IsBasic: is_basic,
                Children: children,
            }

            if (function_data != null) {
                final.FunctionData = function_data
            }

            this.#data.push(final as unknown as Export)
        }

        return this.#data
    }
}

export default Parser;