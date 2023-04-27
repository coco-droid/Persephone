import { AgentAction, AgentFinish, ChainValues, LLMResult } from "../../schema/index.js";
import { BaseCallbackHandler } from "../base.js";
export declare class ConsoleCallbackHandler extends BaseCallbackHandler {
    name: string;
    handleLLMStart(llm: {
        name: string;
    }, prompts: string[], runId: string): void;
    handleLLMError(err: any, runId: string): void;
    handleLLMEnd(output: LLMResult, runId: string): void;
    handleChainStart(chain: {
        name: string;
    }): void;
    handleChainEnd(_output: ChainValues): void;
    handleAgentAction(action: AgentAction): void;
    handleToolEnd(output: string): void;
    handleText(text: string): void;
    handleAgentEnd(action: AgentFinish): void;
}
