import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions, NodeOperationError
} from 'n8n-workflow';
import axios from 'axios';

export class Random implements INodeType {
    description: INodeTypeDescription = {
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

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const min = this.getNodeParameter('min', i) as number;
            const max = this.getNodeParameter('max', i) as number;

            if (!Number.isInteger(min) || !Number.isInteger(max)) {
                throw new NodeOperationError(this.getNode(), `Os valores devem ser inteiros. Recebido: min=${min}, max=${max}`, { itemIndex: i });
            }

            if (min < 0 || max < 0) {
                throw new NodeOperationError(this.getNode(), `Os valores não podem ser negativos. Recebido: min=${min}, max=${max}`, { itemIndex: i });
            }

            if (min > max) {
                throw new NodeOperationError(this.getNode(), `O valor mínimo (${min}) não pode ser maior que o valor máximo (${max}).`, { itemIndex: i });
            }

            if (min === max) {
                throw new NodeOperationError(this.getNode(), `O valor mínimo e máximo não podem ser iguais (${min}).`, { itemIndex: i });
            }

            const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

            const response = await axios.get(url, { responseType: 'text' });

            const randomNumber = parseInt(response.data.trim(), 10);

            returnData.push({
                json: {
                    min,
                    max,
                    randomNumber,
                } as IDataObject,
            });
        }

        return [returnData];
    }
}
