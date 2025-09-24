import { Random } from "../src/Random.node"
import { NodeOperationError } from 'n8n-workflow';
import { describe, expect, test } from '@jest/globals';

const mockThis: any = {
    getInputData: () => [{ json: {} }],
    getNodeParameter: (name: string, index: number) => {
        if (name === 'min') return mockThis.min;
        if (name === 'max') return mockThis.max;
    },
    getNode: () => ({ name: 'Random' }),
};

describe('Random Node - validações', () => {

    const node = new Random();

    test('Deve lançar erro se min for negativo', async () => {
        mockThis.min = -1;
        mockThis.max = 10;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });

    test('Deve lançar erro se max for negativo', async () => {
        mockThis.min = 1;
        mockThis.max = -5;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });

    test('Deve lançar erro se min > max', async () => {
        mockThis.min = 20;
        mockThis.max = 10;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });

    test('Deve lançar erro se min === max', async () => {
        mockThis.min = 5;
        mockThis.max = 5;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });

    test('Deve lançar erro se min não for inteiro', async () => {
        mockThis.min = 2.5;
        mockThis.max = 10;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });

    test('Deve lançar erro se max não for inteiro', async () => {
        mockThis.min = 2;
        mockThis.max = 7.9;
        await expect(node.execute.call(mockThis)).rejects.toThrow(NodeOperationError);
    });
});