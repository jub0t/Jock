import { InstanceType, IsBasic } from "../tools/types"
import { randID } from "../tools/uuid"
import { Export } from "../parser"
import fs from "fs"

enum DirectoryType {
    Global,
    Class,
    Function,
    Object,
    Other
}

export interface Directory<T> {
    Id: String
    Value: any
    Name: String
    Icon: String
    RawCode?: String
    DocCode?: String
    IsFolder: Boolean
    Type: DirectoryType
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

    getCodeBlock(lang: string, label: string, code: PossibleString, grouped: boolean = true): PossibleString {
        if (code == null) return;
        let codeblock = "```" + lang + ` [${label}]` + "\n" + code + "\n```";
        let results = "";

        results += `# ${label}`

        if (grouped) {
            results += `::code-group\n${codeblock}\n::`
        } else {
            results += codeblock
        }

        return results
    }

    generateCode<T>(dir: Directory<T>): PossibleString {
        let main = "";
        main += `# ${dir.Name}\n`

        if (dir.Type == DirectoryType.Class) {
            if (dir?.RawCode != null) {
                main += this.getCodeBlock("js", "Class Code", dir.RawCode)
            }
        }
        else if (dir.Type == DirectoryType.Function) {
            main += this.getCodeBlock("js", "Function Source", dir.RawCode)
        }
        else if (dir.Type == DirectoryType.Object) {
            // ToDo
        }
        else {
            main += this.getCodeBlock("js", "Value", `${dir.Name = dir.Value}`, false)
        }

        return main
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
            Name: exp.Key,
            Value: exp.Value,
            Icon: this.getIconByType(exp.Type),
            IsFolder: exp.Children.length > 0,
            Type: this.changeType(exp.Type),
            Children: [],
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

    generate<T>(asts: Export<T>[], outDir: string) {
        // Initialize directory
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir)
        }

        Object.keys(this.#pages).map((page: string) => {
            const dir = `${outDir}/${page}`
            console.log(dir)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
        })

        const complex = asts.filter(ast => {
            return !ast.IsBasic
        })

        const basics = asts.filter(ast => {
            return ast.IsBasic
        })

        // console.log(complex)
        // console.log(basics)

        // Compile the AST to docs

    }
}
const LocalGenerator = new Generator()
export default Generator
export { LocalGenerator }
