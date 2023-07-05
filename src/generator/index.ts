import { Export } from "../parser"
import { InstanceType, IsBasic } from "../tools/types"
import { randID } from "../tools/uuid"

enum DirectoryType {
    Global,
    Class,
    Function,
    Object,
    Other
}

export interface Directory<T> {
    Id: String,
    Name: String
    Icon: String
    RawCode?: String
    DocCode?: String
    IsFolder: Boolean
    Type: DirectoryType,
    Children?: Directory<T>[]
}


type PossibleString = String | undefined

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

    changeType(itype: InstanceType): DirectoryType {
        if (IsBasic(itype)) {
            return DirectoryType.Global
        } else {
            if (itype == InstanceType.Class) {
                return DirectoryType.Class
            } else if (itype == InstanceType.Function) {
                return DirectoryType.Function
            } else if (itype == InstanceType.Object) {
                return DirectoryType.Object
            } else {
                return DirectoryType.Other
            }
        }
    }

    exportToDirectory<T>(exp: Export<T>): Directory<T> {
        const dir: Directory<T> = {
            Id: randID(16),
            Icon: this.getIconByType(exp.Type),
            IsFolder: exp.Children.length > 0,
            Name: exp.Key,
            Type: this.changeType(exp.Type),
            Children: [],
            DocCode: ""
        };

        dir.RawCode = exp.ClassData?.RawCode || exp.FunctionData?.RawCode
        dir.DocCode = this.generateCode(dir);

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

    getCodeBlock(lang: string, label: string, code: PossibleString): PossibleString {
        if (code == null) return;

        let results = "";
        const codeblock = "```" + lang + ` [${label}]` + "\n" + code + "\n```";

        results += `# ${label}`
        results += `::code-groupn\n${codeblock}\n::`

        return results
    }

    generateCode<T>(dir: Directory<T>): PossibleString {
        if (dir.Type == DirectoryType.Class) {
            return this.getCodeBlock("js", "Class Code", dir.RawCode)
        } else {
            return ""
        }
    }
}
const LocalGenerator = new Generator()

export { LocalGenerator }
export default Generator
