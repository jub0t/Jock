import { InstanceType, IsBasic } from "../tools/types"
import { randID } from "../tools/uuid"
import { AnyMap, Export } from "../parser"
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
type PossibleString = String | undefined

class Generator<T> {
    #outdir: string = "./out";
    #pages: AnyMap = {
        functions: [],
        globals: [],
        classes: [],
        objects: [],
    }

    constructor(outDir: string) {
        this.#outdir = outDir
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

    build<T>(asts: Export<T>[]) {
        // Initialize directory
        if (!fs.existsSync(this.#outdir)) {
            fs.mkdirSync(this.#outdir)
        }

        Object.keys(this.#pages).map((page: string) => {
            const dir = `${this.#outdir}/${page}`

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
            if (ast.Type === InstanceType.Class) {
                this.#pages.classes.push(dir)
            }
        })

        basics.map((ast) => {
        })

        // Compile the AST to docs

    }

    // Can be used for objects
    sortByType<T>(dirs: Directory<T>[]) {
        let type_map: { [key: string]: Directory<T>[] } = {}

        for (let x = 0; x < dirs.length; x++) {
            const dir = dirs[x];

            type_map[dir.Type].push(dir)
        }

        return type_map
    }

    export() {
        const pages = Object.keys(this.#pages);
        for (let p = 0; p < pages.length; p++) {
            const name = pages[p];
            const page = this.#pages[name];

            console.log(`Processing ${name}>`)
            for (let x = 0; x < page.length; x++) {
                const dir = page[x];
                console.log(dir.DocCode)
            }
        }
    }
}
const LocalGenerator = new Generator("./out")
export { LocalGenerator }
export default Generator
