import { Export } from "../parser"

export interface Page { }
export interface DirFileConfig {
    Icon: string
    Title: string
}

class Generator {
    #pages = []

    generateDirFile(dc: DirFileConfig) {
        let data = []

        if (dc.Icon != null) {
            data.push(`icon: ${dc.Icon}`)
        }

        if (dc.Title != null) {
            data.push(`title: ${dc.Title}`)
        }

        return data.join("\n")
    }


    generateCore<T>(exp: Export<T>) {

    }
}

export default Generator
