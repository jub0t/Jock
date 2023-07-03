import { Export } from "../parser";
import { InstanceType } from "../tools/types";

class Debug {
    RecursiveIter(parent: Export, depth = 0) {
        if (parent.Children.length > 0) {
            for (const child of parent.Children) {
                console.log(`${" ".repeat(depth * 4)}- ${parent.Key}.${child.Key}`);

                if (child.Type == InstanceType.Class) {
                    if (child.Key != "constructor") {
                        this.RecursiveIter(child, depth + 1)
                    }
                }
            }
        }
    }
}

export default new Debug()