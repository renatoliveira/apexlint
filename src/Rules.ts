import { Context } from "./Context";
import { LinterError } from "./LinterError";

export class Rules {
    public static lineLimit (ctx: Context) {
        ctx.content.forEach((line, index) => {
            if (line.length > 120) {
                ctx.addError(new LinterError(index + 1, 'Line exceeds the limit of 120 characters.'))
            }
        })
    }

    public static assignmentOnSameLine (ctx: Context) {
        ctx.content.forEach((line, index) => {
            if (line.match(/^(\t+|\s+)=/g) || line.match(/=(\s|\t)*$/g)) {
                ctx.addError(new LinterError(index + 1, 'Assignments must be on the same line.'))
            }
        })
    }
}