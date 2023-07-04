import { Export } from "../parser"
import { InstanceType, IsBasic } from "../tools/types"
import { randID } from "../tools/uuid"

export interface Directory<T> {
    Id: String,
    Name: String
    Icon: String
    RawCode: String
    IsFolder: Boolean
    Children?: Directory<T>[]
}

class Generator<T> {
    #pages: { [key: string]: Directory<T>[] } = {
        globals: [],
        functions: [],
        classes: [],
        objects: [],
    }

    getIconByType(typen: InstanceType): String {
        if (IsBasic(typen)) {
            return "heroicons-outline:globe-alt"
        } else if (typen === InstanceType.Object) {
            return "heroicons-outline:cube-transparent"
        } else if (typen === InstanceType.Class) {
            return "heroicons-outline:document-text"
        } else if (typen === InstanceType.Function) {
            return "heroicons-outline:beaker"
        } else {
            return ""
        }
    }

    generateCode<T>(dir: Directory<T>): String {
        return ""
    }

    exportToDirectory<T>(exp: Export<T>): Directory<T> {
        const dir: Directory<T> = {
            Id: randID(16),
            Icon: this.getIconByType(exp.Type),
            IsFolder: exp.Children.length > 0,
            Name: exp.Key,
            Children: [],
            RawCode: ""
        };

        dir.RawCode = this.generateCode(dir);

        if (exp.Type == InstanceType.Class) {
            exp.Children.forEach(child => {
                if (child.Key != "constructor") {
                    const childDir = this.exportToDirectory(child)
                    dir.Children?.push(childDir)
                }
            });
        }

        return dir;
    }
}
const LocalGenerator = new Generator()

export { LocalGenerator }
export default Generator
