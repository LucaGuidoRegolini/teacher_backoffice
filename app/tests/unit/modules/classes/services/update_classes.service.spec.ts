import { UpdateClassesService } from '@modules/classes/services/update_classes.service';
import { MockClasseRepository } from '@tests/doubles/repositories/in-memory.repository';
import { Classe } from '@modules/classes/domains/classe.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockClasseRepository = MockClasseRepository.getInstance();

describe('Delete classes service', () => {
  let updateClassesService: UpdateClassesService;

  beforeEach(() => {
    updateClassesService = UpdateClassesService.getInstance(mockClasseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateClassesService).toBeDefined();
  });

  it('should update a class', async () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    mockClasseRepository.findOne = rightResponse(new SuccessfulResponse(classe));
    mockClasseRepository.update = rightResponse(new SuccessfulResponse(classe));

    const date = new Date();

    const classeCreated = await updateClassesService.execute({
      classes_id: classe.id,
      title: 'any_title_2',
      date: date,
      description: 'any_description_2',
      user_id: 'any_user_id',
    });

    const classe_web = classeCreated.map((user) => user);

    expect(classeCreated.isRight()).toBeTruthy();
    expect(classe_web.id).toBeDefined();
    expect(classe_web.title).toBe('any_title_2');
    expect(classe_web.date).toBe(date);
    expect(classe_web.description).toBe('any_description_2');
  });
  it('should not update a class because classe not exist', async () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    mockClasseRepository.findOne = rightResponse(new SuccessfulResponse(undefined));

    const classeCreated = await updateClassesService.execute({
      classes_id: classe.id,
      title: 'any_title_2',
      user_id: 'any_user_id',
    });

    expect(classeCreated.isLeft()).toBeTruthy();
    expect(classeCreated.value).toBeInstanceOf(BadRequestError);
  });
});
