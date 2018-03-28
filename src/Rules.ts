import { Context } from "./Context";
import { LinterError } from "./RuleViolation";

export class Rules {

    public static run (ctx: Context): void {
        ctx.getContent().forEach((line, index) => {
            Rules.lineLimit(line, index, ctx)
            Rules.queryStructure(line, index, ctx)
            Rules.lineWithTODO(line, index, ctx)
            Rules.queryWithoutCondition(line, index, ctx)
            Rules.whiteSpace(line, index, ctx)
        })
    }

    public static queryStructure (line: string, index: number, ctx: Context): void {
        if (line.match(/(where.+)?(and|limit).*\]/i) || line.match(/,\s*\w+(\s+)?(\n*)?from/i)) {
            ctx.addError(new LinterError(
                'W0001',
                'SOQL query with more than one condition and/or field being searched should be splitted into multiple lines.',
                index + 1,
                line
            ))
        }
    }

    public static queryWithoutCondition (line: string, index: number, ctx: Context): void {
        if (ctx.getSOQLCount() > 0) {
            if (line.match(/from \w+\s*\]/i)) {
                ctx.addError(new LinterError(
                    'W0002',
                    'SOQL query without condition.',
                    index + 1,
                    line
                ))
            }
        }
    }

    public static lineWithTODO (line: string, index: number, ctx: Context): void {
        if (line.match(/\/\/\s?TODO\s?:/g)) {
            ctx.foundTodo();
            ctx.addError(new LinterError(
                'W0003',
                'TODO found, with missing feature.',
                index + 1,
                line
            ))
        }
    }

    public static whiteSpace (line: string, index: number, ctx: Context): void {
        if (line.search('if\\(') != -1) {
            ctx.addError(new LinterError(
                'W0004',
                'Missing space between "if" and "(".',
                index + 1,
                line
            ))
        }
        if (line.search('for\\(') != -1) {
            ctx.addError(new LinterError(
                'W0005',
                'Missing space between "for" and "(".',
                index + 1,
                line
            ))
        }
        if (line.search('else\\{') != -1) {
            ctx.addError(new LinterError(
                'W0006',
                'Missing space between "else" and "{".',
                index + 1,
                line
            ))
        }
        if (line.search('\\}else') != -1) {
            ctx.addError(new LinterError(
                'W0007',
                'Missing space between "}" and "else".',
                index +1,
                line
            ))
        }
    }

 

    public static bracketsDontMatch (index: number, ctx: Context) {
        ctx.addError(new LinterError(
            'E0001',
            'Brackets ("{" and "}") count don\'t match.',
            index + 1,
            ctx.getContent()[index]
        ))
    }

    public static invalidClass (index: number, ctx: Context) {
        ctx.addError(new LinterError(
            'E0002',
            'Class is invalid.',
            index + 1,
            ctx.getContent()[index]
        ))
    }

    public static lineLimit (line: string, index: number, ctx: Context): void {
        if (line.length > 120) {
            ctx.addError(new LinterError(
                'E0003',
                'Line exceeds the limit of 120 characters.',
                index + 1,
                line
            ))
        }
    }

    public static inlineSOQLInsideLoop (line: string, index: number, ctx: Context) {
        ctx.addError(new LinterError(
            'E0004',
            'SOQL inside loops are not allowed.',
            index + 1,
            line
        ))
    }
}