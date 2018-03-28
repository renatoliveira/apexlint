import { Context } from "./Context";
import { RuleViolation } from "./RuleViolation";

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
            if (this.isIgnored(ctx, index, 'W0001')) return
            ctx.addError(new RuleViolation(
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
                if (this.isIgnored(ctx, index, 'W0002')) return
                ctx.addError(new RuleViolation(
                    'W0002',
                    'SOQL query without condition.',
                    index + 1,
                    line
                ))
            }
        }
    }

    public static lineWithTODO (line: string, index: number, ctx: Context): void {
        if (line.match(/\/\/\s?TODO\s?:/gi)) {
            ctx.foundTodo();
            console.log('Found todo')
            if (!this.isIgnored(ctx, index, 'W0003')) {
                console.log('after ignored')
                ctx.addError(new RuleViolation(
                    'W0003',
                    'TODO found, with missing feature.',
                    index + 1,
                    line
                ))
            }
        }
    }

    public static whiteSpace (line: string, index: number, ctx: Context): void {
        if (line.search('if\\(') != -1) {
            if (this.isIgnored(ctx, index, 'W0004')) return
            ctx.addError(new RuleViolation(
                'W0004',
                'Missing space between "if" and "(".',
                index + 1,
                line
            ))
        }
        if (line.search('for\\(') != -1) {
            if (this.isIgnored(ctx, index, 'W0005')) return
            ctx.addError(new RuleViolation(
                'W0005',
                'Missing space between "for" and "(".',
                index + 1,
                line
            ))
        }
        if (line.search('else\\{') != -1) {
            if (this.isIgnored(ctx, index, 'W0006')) return
            ctx.addError(new RuleViolation(
                'W0006',
                'Missing space between "else" and "{".',
                index + 1,
                line
            ))
        }
        if (line.search('\\}else') != -1) {
            if (this.isIgnored(ctx, index, 'W0007')) return
            ctx.addError(new RuleViolation(
                'W0007',
                'Missing space between "}" and "else".',
                index +1,
                line
            ))
        }
    }

    public static bracketsDontMatch (index: number, ctx: Context): void {
        if (this.isIgnored(ctx, index, 'E0001')) return
        ctx.addError(new RuleViolation(
            'E0001',
            'Brackets ("{" and "}") count don\'t match.',
            index + 1,
            ctx.getContent()[index]
        ))
    }

    public static invalidClass (index: number, ctx: Context): void {
        if (this.isIgnored(ctx, index, 'E0002')) return
        ctx.addError(new RuleViolation(
            'E0002',
            'Class is invalid.',
            index + 1,
            ctx.getContent()[index]
        ))
    }

    public static lineLimit (line: string, index: number, ctx: Context): void {
        if (this.isIgnored(ctx, index, 'E0003')) return
        if (line.length > 120) {
            ctx.addError(new RuleViolation(
                'E0003',
                'Line exceeds the limit of 120 characters.',
                index + 1,
                line
            ))
        }
    }

    public static inlineSOQLInsideLoop (line: string, index: number, ctx: Context): void {
        if (this.isIgnored(ctx, index, 'E0004')) return
        ctx.addError(new RuleViolation(
            'E0004',
            'SOQL inside loops are not allowed.',
            index + 1,
            line
        ))
    }

    private static isIgnored (ctx: Context, lineNumber: number, errorCode: string): boolean {
        let lineAbove: string = ctx.getContent()[lineNumber-1]
        if (lineAbove != undefined
                && lineAbove.toLowerCase().match(/\/\/\s*linter-ignore-((W|E)\d{4},?\s?)*/g) != null) {
            let codes = lineAbove.toLowerCase().match(/(W|E)\d{4}/gi)
            if (codes) {
                for (const code of codes) {
                    if (code.toLowerCase() === errorCode.toLowerCase()) {
                        return true
                    }
                }
            }
        }
        return false
    }
}