import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    /**
     * Como estamos somente com um parãmetro, não precisamos utilizar o where.
     */
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction id does not exist.');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
