import { Context } from "./Context";
import { LinterError } from "./LinterError";

export class Rules {

    public static run (ctx: Context): void {
        ctx.content.forEach((line, index) => {
            Rules.lineLimit(line, index, ctx)
            Rules.assignmentOnSameLine(line, index, ctx)
            Rules.queryStructure(line, index, ctx)
        })
    }

    public static lineLimit (line: string, index: number, ctx: Context): void {
        if (line.length > 120) {
            ctx.addError(new LinterError(index + 1, 'Line exceeds the limit of 120 characters.'))
        }
    }

    public static assignmentOnSameLine (line: string, index: number, ctx: Context): void {
        if (line.match(/^(\t+|\s+)=/g) || line.match(/=(\s|\t)*$/g)) {
            ctx.addError(new LinterError(index + 1, 'Assignments must be on the same line.'))
        }
    }

    public static queryStructure (line: string, index: number, ctx: Context): void {
        if (line.match(/(where.+)?(and|limit).*\]/i) || line.match(/,\s*\w+(\s+)?(\n*)?from/i)) {
            ctx.addError(new LinterError(index + 1, 'SOQL query with more than one condition and/or field being searched should be splitted into multiple lines.'))
        }
    }
}