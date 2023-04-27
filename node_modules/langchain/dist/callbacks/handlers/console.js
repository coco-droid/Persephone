import { BaseCallbackHandler } from "../base.js";
export class ConsoleCallbackHandler extends BaseCallbackHandler {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "console_callback_handler"
        });
    }
    handleLLMStart(llm, prompts, runId) {
        console.log(`Starting LLM ${runId} with name ${llm.name} with prompts: ${prompts.join(", ")}\n`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleLLMError(err, runId) {
        console.log(`LLM ${runId} errored: ${err}\n`);
    }
    handleLLMEnd(output, runId) {
        console.log(`LLM ${runId} finished: ${JSON.stringify(output)}\n`);
    }
    handleChainStart(chain) {
        console.log(`Entering new ${chain.name} chain...`);
    }
    handleChainEnd(_output) {
        console.log("Finished chain.");
    }
    handleAgentAction(action) {
        console.log(action.log);
    }
    handleToolEnd(output) {
        console.log(output);
    }
    handleText(text) {
        console.log(text);
    }
    handleAgentEnd(action) {
        console.log(action.log);
    }
}
