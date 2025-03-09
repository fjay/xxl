export interface MathProblem {
    expression: string;
    result: number;
    id: string;
}

type OperationType = '+' | '-' | '*';

export class MathGenerator {
    private static generateRandomNumber(max: number): number {
        return Math.floor(Math.random() * max) + 1;
    }

    private static generateOperation(level: number): OperationType {
        if (level <= 2) return Math.random() < 0.5 ? '+' : '-';
        if (level === 3) return '*';
        return ['+', '-', '*'][Math.floor(Math.random() * 3)] as OperationType;
    }

    static generateProblem(level: number): MathProblem {
        let num1: number, num2: number, result: number, expression: string;

        const operation = this.generateOperation(level);

        switch (level) {
            case 1: // 10以内加减法
                num1 = this.generateRandomNumber(10);
                num2 = this.generateRandomNumber(10);
                break;
            case 2: // 20以内加减法
                num1 = this.generateRandomNumber(20);
                num2 = this.generateRandomNumber(20);
                break;
            case 3: // 乘法表
                num1 = this.generateRandomNumber(9);
                num2 = this.generateRandomNumber(9);
                break;
            default: // 混合运算
                num1 = this.generateRandomNumber(20);
                num2 = this.generateRandomNumber(10);
        }

        // 确保减法结果为正数
        if (operation === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        switch (operation) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            default:
                throw new Error('Invalid operation');
        }

        expression = `${num1} ${operation} ${num2}`;

        return {
            expression,
            result,
            id: Math.random().toString(36).substr(2, 9)
        };
    }

    static generateProblemPair(): [MathProblem, MathProblem] {
        const savedLevel = localStorage.getItem('mathGameLevel');
        const level = savedLevel ? parseInt(savedLevel) : 1;
        const problem1 = this.generateProblem(level);
        let problem2: MathProblem;

        do {
            problem2 = this.generateProblem(level);
        } while (problem2.result !== problem1.result);

        // 随机决定返回顺序，增加游戏难度
        return [problem1, problem2];
    }
}