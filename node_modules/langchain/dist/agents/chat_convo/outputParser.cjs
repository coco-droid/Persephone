"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatConversationalAgentOutputParser = void 0;
const types_js_1 = require("../types.cjs");
const prompt_js_1 = require("./prompt.cjs");
class ChatConversationalAgentOutputParser extends types_js_1.AgentActionOutputParser {
    async parse(text) {
        let jsonOutput = text.trim();
        if (jsonOutput.includes("```json")) {
            jsonOutput = jsonOutput.split("```json")[1].trimStart();
        }
        if (jsonOutput.includes("```")) {
            jsonOutput = jsonOutput.split("```")[0].trimEnd();
        }
        if (jsonOutput.startsWith("```")) {
            jsonOutput = jsonOutput.slice(3).trimStart();
        }
        if (jsonOutput.endsWith("```")) {
            jsonOutput = jsonOutput.slice(0, -3).trimEnd();
        }
        const response = JSON.parse(jsonOutput);
        const { action, action_input } = response;
        if (action === "Final Answer") {
            return { returnValues: { output: action_input }, log: text };
        }
        return { tool: action, toolInput: action_input, log: text };
    }
    getFormatInstructions() {
        return prompt_js_1.FORMAT_INSTRUCTIONS;
    }
}
exports.ChatConversationalAgentOutputParser = ChatConversationalAgentOutputParser;
