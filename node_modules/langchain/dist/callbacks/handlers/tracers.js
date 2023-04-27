import { BaseCallbackHandler } from "../base.js";
export class BaseTracer extends BaseCallbackHandler {
    constructor() {
        super();
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "executionOrder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
    }
    async newSession(sessionName) {
        const sessionCreate = {
            start_time: Date.now(),
            name: sessionName,
        };
        const session = await this.persistSession(sessionCreate);
        this.session = session;
        return session;
    }
    _addChildRun(parentRun, childRun) {
        if (childRun.type === "llm") {
            parentRun.child_llm_runs.push(childRun);
        }
        else if (childRun.type === "chain") {
            parentRun.child_chain_runs.push(childRun);
        }
        else if (childRun.type === "tool") {
            parentRun.child_tool_runs.push(childRun);
        }
        else {
            throw new Error("Invalid run type");
        }
    }
    _startTrace(run) {
        this.executionOrder += 1;
        if (run.parent_uuid) {
            const parentRun = this.runMap.get(run.parent_uuid);
            if (parentRun) {
                if (!(parentRun.type === "tool" || parentRun.type === "chain")) {
                    throw new Error("Caller run can only be a tool or chain");
                }
                else {
                    this._addChildRun(parentRun, run);
                }
            }
            else {
                throw new Error(`Caller run ${run.parent_uuid} not found`);
            }
        }
        this.runMap.set(run.uuid, run);
    }
    async _endTrace(run) {
        if (!run.parent_uuid) {
            await this.persistRun(run);
            this.executionOrder = 1;
        }
        this.runMap.delete(run.uuid);
    }
    async handleLLMStart(llm, prompts, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: llm,
            prompts,
            session_id: this.session.id,
            execution_order: this.executionOrder,
            type: "llm",
        };
        this._startTrace(run);
    }
    async handleLLMEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        const llmRun = run;
        llmRun.end_time = Date.now();
        llmRun.response = output;
        await this._endTrace(llmRun);
    }
    async handleLLMError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        const llmRun = run;
        llmRun.end_time = Date.now();
        llmRun.error = error.message;
        await this._endTrace(llmRun);
    }
    async handleChainStart(chain, inputs, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: chain,
            inputs,
            session_id: this.session.id,
            execution_order: this.executionOrder,
            type: "chain",
            child_llm_runs: [],
            child_chain_runs: [],
            child_tool_runs: [],
        };
        this._startTrace(run);
    }
    async handleChainEnd(outputs, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "chain") {
            throw new Error("No chain run to end.");
        }
        const chainRun = run;
        chainRun.end_time = Date.now();
        chainRun.outputs = outputs;
        await this._endTrace(chainRun);
    }
    async handleChainError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "chain") {
            throw new Error("No chain run to end.");
        }
        const chainRun = run;
        chainRun.end_time = Date.now();
        chainRun.error = error.message;
        await this._endTrace(chainRun);
    }
    async handleToolStart(tool, input, runId, parentRunId) {
        if (this.session === undefined) {
            this.session = await this.loadDefaultSession();
        }
        const run = {
            uuid: runId,
            parent_uuid: parentRunId,
            start_time: Date.now(),
            end_time: 0,
            serialized: tool,
            tool_input: input,
            session_id: this.session.id,
            execution_order: this.executionOrder,
            type: "tool",
            action: JSON.stringify(tool),
            child_llm_runs: [],
            child_chain_runs: [],
            child_tool_runs: [],
        };
        this._startTrace(run);
    }
    async handleToolEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "tool") {
            throw new Error("No tool run to end");
        }
        const toolRun = run;
        toolRun.end_time = Date.now();
        toolRun.output = output;
        await this._endTrace(toolRun);
    }
    async handleToolError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.type !== "tool") {
            throw new Error("No tool run to end");
        }
        const toolRun = run;
        toolRun.end_time = Date.now();
        toolRun.error = error.message;
        await this._endTrace(toolRun);
    }
}
export class LangChainTracer extends BaseTracer {
    constructor() {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "langchain_tracer"
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (typeof process !== "undefined"
                ? // eslint-disable-next-line no-process-env
                    process.env?.LANGCHAIN_ENDPOINT
                : undefined) || "http://localhost:8000"
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                "Content-Type": "application/json",
            }
        });
        // eslint-disable-next-line no-process-env
        if (typeof process !== "undefined" && process.env?.LANGCHAIN_API_KEY) {
            // eslint-disable-next-line no-process-env
            this.headers["x-api-key"] = process.env?.LANGCHAIN_API_KEY;
        }
    }
    async persistRun(run) {
        let endpoint;
        if (run.type === "llm") {
            endpoint = `${this.endpoint}/llm-runs`;
        }
        else if (run.type === "chain") {
            endpoint = `${this.endpoint}/chain-runs`;
        }
        else {
            endpoint = `${this.endpoint}/tool-runs`;
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(run),
        });
        if (!response.ok) {
            console.error(`Failed to persist run: ${response.status} ${response.statusText}`);
        }
    }
    async persistSession(sessionCreate) {
        const endpoint = `${this.endpoint}/sessions`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(sessionCreate),
        });
        if (!response.ok) {
            console.error(`Failed to persist session: ${response.status} ${response.statusText}, using default session.`);
            return {
                id: 1,
                ...sessionCreate,
            };
        }
        return {
            id: (await response.json()).id,
            ...sessionCreate,
        };
    }
    async loadSession(sessionName) {
        const endpoint = `${this.endpoint}/sessions?name=${sessionName}`;
        return this._handleSessionResponse(endpoint);
    }
    async loadDefaultSession() {
        const endpoint = `${this.endpoint}/sessions?name=default`;
        return this._handleSessionResponse(endpoint);
    }
    async _handleSessionResponse(endpoint) {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: this.headers,
        });
        let tracerSession;
        if (!response.ok) {
            console.error(`Failed to load session: ${response.status} ${response.statusText}`);
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        const resp = (await response.json());
        if (resp.length === 0) {
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        [tracerSession] = resp;
        this.session = tracerSession;
        return tracerSession;
    }
    copy() {
        // TODO: this is a hack to get tracing to work with the current backend
        // we need to not use execution order, then remove this check
        if (this.executionOrder === 1) {
            const copy = new LangChainTracer();
            copy.session = this.session;
            copy.runMap = new Map(this.runMap);
            copy.executionOrder = this.executionOrder;
            return copy;
        }
        return this;
    }
}
