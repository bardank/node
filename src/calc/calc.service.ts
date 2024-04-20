import { CalcDto } from './calc.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CalcService {
  public calculateExpression(calcBody: CalcDto) {
    try {
      const { expression } = calcBody;
      if (!this.isValidExpression(expression)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid expression provided',
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = this.evaluateExpression(expression);
      return { result: result };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private isValidExpression(expression: string): boolean {
    const regex = /^(\d+(\.\d+)?[+\-*\/])+(\d+(\.\d+)?)$/;
    return regex.test(expression);
  }

  private evaluateExpression(expression: string): number {
    const tokens = this.tokenizeExpression(expression);
    const postfix = this.convertToPostfix(tokens);
    return this.evaluatePostfix(postfix);
  }

  private tokenizeExpression(expression: string): string[] {
    return expression.match(/(\d+(\.\d+)?)|(\+|\-|\*|\/)/g) || [];
  }

  private precedence(operator: string): number {
    switch (operator) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      default:
        return 0;
    }
  }

  private convertToPostfix(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (token.match(/\d+(\.\d+)?/)) {
        outputQueue.push(token);
      } else {
        while (
          operatorStack.length &&
          this.precedence(token) <=
            this.precedence(operatorStack[operatorStack.length - 1])
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      }
    }

    while (operatorStack.length) {
      const topOperator = operatorStack.pop()!;
      outputQueue.push(topOperator);
    }

    return outputQueue;
  }

  private evaluatePostfix(postfix: string[]): number {
    const stack: number[] = [];

    for (const token of postfix) {
      if (token.match(/\d+(\.\d+)?/)) {
        stack.push(parseFloat(token));
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) {
              throw new HttpException(
                {
                  statusCode: HttpStatus.BAD_REQUEST,
                  message: 'Invalid expression provided',
                  error: 'Bad Request',
                },
                HttpStatus.BAD_REQUEST,
              );
            }
            stack.push(a / b);
            break;
        }
      }
    }

    if (stack.length !== 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return stack.pop()!;
  }
}
