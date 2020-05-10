import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import transactionsRouter from '../routes/transactions.routes';

interface Request {
  title: string;
  type: 'income' | 'outcome'; // lembrando que podemos ter somente esses dados
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    /**
     * Validações
     * - Se existe saldo disponível;
     * - Se a categoria já existe;
     * - Se as entradas estão válidas
     */

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category); // Será criado o repositório apartir da Model.

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome') {
      if (total < value) {
        throw new AppError('You need to work more!', 400);
      }
    }

    let transactionCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    /**
     * Lembrando que precisamos salvar as informações após criamos
     * os dados dentro de nosso database.
     */
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
