import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // Como já estamos no repositório, podemos utilizar o this.

    const transactions = await this.find();

    const balance = transactions.reduce(
      (accumulator, current) => {
        if (current.type === 'income') {
          accumulator.income += Number(current.value);
        } else {
          accumulator.outcome += Number(current.value);
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        balance: 0,
      },
    );

    const { income, outcome } = balance;
    const total = income - outcome;

    /**
     * Os valores podem ser retornados do banco de dados como uma string.
     * Precisamos forçar a formatação para Number.
     */
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
