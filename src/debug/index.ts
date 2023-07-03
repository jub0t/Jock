import { Export } from "../parser";
import { InstanceType } from "../tools/types";

class Debug {
    PrintStructure(parent: Export, depth = 0) {
        if (parent.Children.length > 0) {
            for (const child of parent.Children) {
                console.log(`${" ".repeat(depth * 4)}- ${parent.Key}.${child.Key}`);

                if (child.Type == InstanceType.Class) {
                    // We don't proccess the constructor because child.constructor = Parent
                    if (child.Key != "constructor") {
                        this.PrintStructure(child, depth + 1)
                    }
                }
            }
        }
        else {
            console.log(`${" ".repeat(depth * 4)}- ${parent.Key}<${parent.Type}>(${parent.FunctionData != null ? parent.FunctionData.Params.join(", ") : ""})`);
        }
    }
}

export default new Debug()