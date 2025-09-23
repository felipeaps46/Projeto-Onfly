"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const axios_1 = __importDefault(require("axios"));
class Random {
    constructor() {
        this.description = {
            displayName: 'Random',
            name: 'Random',
            icon: 'file:Random.svg',
            group: ['transform'],
            version: 1,
            description: 'Gera números randômicos usando Random.org',
            defaults: {
                name: 'Random',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Min',
                    name: 'min',
                    type: 'number',
                    default: 1,
                    description: 'Número mínimo (inclusivo)',
                },
                {
                    displayName: 'Max',
                    name: 'max',
                    type: 'number',
                    default: 100,
                    description: 'Número máximo (inclusivo)',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const min = this.getNodeParameter('min', i);
            const max = this.getNodeParameter('max', i);
            if (!Number.isInteger(min) || !Number.isInteger(max)) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Os valores devem ser inteiros. Recebido: min=${min}, max=${max}`, { itemIndex: i });
            }
            if (min < 0 || max < 0) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Os valores não podem ser negativos. Recebido: min=${min}, max=${max}`, { itemIndex: i });
            }
            if (min > max) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `O valor mínimo (${min}) não pode ser maior que o valor máximo (${max}).`, { itemIndex: i });
            }
            if (min === max) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `O valor mínimo e máximo não podem ser iguais (${min}).`, { itemIndex: i });
            }
            const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
            const response = await axios_1.default.get(url, { responseType: 'text' });
            const randomNumber = parseInt(response.data.trim(), 10);
            returnData.push({
                json: {
                    min,
                    max,
                    randomNumber,
                },
            });
        }
        return [returnData];
    }
}
exports.Random = Random;
