import { CreateClassesService } from '@modules/classes/services/create_classes.service';
import { MockClasseRepository } from '@tests/doubles/repositories/in-memory.repository';
import { Classe } from '@modules/classes/domains/classe.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockClasseRepository = MockClasseRepository.getInstance();

describe('Create classes service', () => {
  let createClassesService: CreateClassesService;

  beforeEach(() => {
    createClassesService = CreateClassesService.getInstance(mockClasseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createClassesService).toBeDefined();
  });

  it('should create a class', async () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    mockClasseRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    mockClasseRepository.create = rightResponse(new SuccessfulResponse(classe));

    const classeCreated = await createClassesService.execute({
      title: 'any_title',
      description: 'any_description',
      date: new Date(),
      user_id: 'any_user_id',
    });

    const classe_web = classeCreated.map((user) => user);

    expect(classeCreated.isRight()).toBeTruthy();
    expect(classe_web.id).toBeDefined();
    expect(classe_web.title).toBe('any_title');
  });

  it('should not create a class because classes already exist', async () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    mockClasseRepository.findOne = rightResponse(new SuccessfulResponse(classe));
    mockClasseRepository.create = rightResponse(new SuccessfulResponse(classe));

    const classeCreated = await createClassesService.execute({
      title: 'any_title',
      description: 'any_description',
      date: new Date(),
      user_id: 'any_user_id',
    });

    expect(classeCreated.isLeft()).toBeTruthy();
    expect(classeCreated.value).toBeInstanceOf(BadRequestError);
  });
});
