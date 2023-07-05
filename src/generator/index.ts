import { InstanceType, IsBasic } from "../tools/types"
import { randID } from "../tools/uuid"
import { Export } from "../parser"
import fs from "fs"

enum DirectoryType {
    Function = "Function",
    Global = "Global",
    Object = "Object",
    Class = "Class",
    Other = "Other"
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

type Pages<T> = { [key: string]: Directory<T>[] }
type PossibleString = String | undefined

class Generator<T> {
    #pages: Pages<T> = {
        functions: [],
        globals: [],
        classes: [],
        objects: [],
    }

    IsBasic(type_name: DirectoryType) {
        return type_name == DirectoryType.Function ||
            type_name == DirectoryType.Object ||
            type_name == DirectoryType.Other ||
            type_name == DirectoryType.Class;
    }

    getCodeBlock(lang: string, label: string, dir: Directory<T>): PossibleString {
        let results = "";

        let codeblock = "";
        if (this.IsBasic(dir.Type)) {
            codeblock += "```" + lang + ` [${label}]` + "\n" + dir.RawCode + "\n```"
        } else {
            codeblock += "```" + lang + ` [${label}]` + "\n" + dir.Name + " = " + dir.Value + "\n```"
        }

        if (this.IsBasic(dir.Type)) {
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
            main += this.getCodeBlock("js", "Class Code", dir)
        }
        else if (dir.Type == DirectoryType.Object) {
        }
        else if (dir.Type == DirectoryType.Function) {
            main += this.getCodeBlock("js", "Function Source", dir)
        }
        else {
            main += this.getCodeBlock("js", "Value", dir)
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

        complex.map(ast => {
            const dir = this.exportToDirectory(ast)
            const file = this.generateCode(dir)

            console.log(file, "\n\n\n")
        })

        basics.map((ast) => {
            const dir = this.exportToDirectory(ast)
            const file = this.generateCode(dir)

            console.log(file, "\n\n\n")
        })

        // Compile the AST to docs

    }

    export() {
        const pages = Object.keys(this.#pages);
        for (let p = 0; p < pages.length; p++) {
            const name = pages[p];
            const page = this.#pages[name];

            console.log(page)
        }
    }
}
const LocalGenerator = new Generator()
export { LocalGenerator }
export default Generator
