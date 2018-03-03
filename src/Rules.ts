import { Context } from "./Context";
import { LinterError } from "./LinterError";

export class Rules {
    public static lineLimit (ctx: Context) {
        ctx.content.forEach(line => {
            if (line.length > 120) {
                ctx.addError(new LinterError(undefined, 'Line exceeds the limit of 120 characters.'))
            }
        })
    }
}