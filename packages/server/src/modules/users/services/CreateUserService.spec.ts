import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakehashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakehashProvider
    );

    const user = await createUser.execute({
      name: 'Mario Prato',
      email: 'mario@contact.com',
      password: '12345678'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email from another', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakehashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakehashProvider
    );

    await createUser.execute({
      name: 'Mario Prato',
      email: 'mario@contact.com',
      password: '12345678'
    });

    expect(
      createUser.execute({
        name: 'Mario Prato',
        email: 'mario@contact.com',
        password: '12345678'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
