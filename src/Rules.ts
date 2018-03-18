import { Context } from "./Context";
import { LinterError } from "./LinterError";

export class Rules {

    public static run (ctx: Context): void {
        ctx.getContent().forEach((line, index) => {
            Rules.lineLimit(line, index, ctx)
            Rules.queryStructure(line, index, ctx)
            Rules.lineWithTODO(line, index, ctx)
            Rules.queryWithoutCondition(line, index, ctx)
        })
    }

    public static lineLimit (line: string, index: number, ctx: Context): void {
        if (line.length > 120) {
            ctx.addError(new LinterError(index + 1, 'Line exceeds the limit of 120 characters.'))
        }
    }

    public static queryStructure (line: string, index: number, ctx: Context): void {
        if (line.match(/(where.+)?(and|limit).*\]/i) || line.match(/,\s*\w+(\s+)?(\n*)?from/i)) {
            ctx.addError(new LinterError(index + 1, 'SOQL query with more than one condition and/or field being searched should be splitted into multiple lines.'))
        }
    }

    public static queryWithoutCondition (line: string, index: number, ctx: Context): void {
        if (ctx.getSOQLCount() > 0) {
            if (line.match(/from \w+\s*\]/i)) {
                ctx.addError(new LinterError(index + 1, 'SOQL query without condition.'))
            }
        }
    }

    public static lineWithTODO (line: string, index: number, ctx: Context): void {
        if (line.match(/\/\/\s?TODO\s?:/g)) {
            ctx.foundTodo();
            ctx.addError(new LinterError(index + 1, 'TODO found, with missing feature.'))
        }
    }
}