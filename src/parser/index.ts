import Match from "../tools/Match";

enum ExportType {
    Function,
    Class,
    Variable,
}

interface Export {
    Type: Int16Array
}

class Parser {
    private data: Export[] = [];
}

export default Parser;