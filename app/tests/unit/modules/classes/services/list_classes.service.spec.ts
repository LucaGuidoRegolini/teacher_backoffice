import { MockClasseRepository } from '@tests/doubles/repositories/in-memory.repository';
import { ListClassesService } from '@modules/classes/services/list_classes.service';
import { Classe } from '@modules/classes/domains/classe.domain';
import { rightResponse } from '@tests/mocks/responses';

const mockClasseRepository = MockClasseRepository.getInstance();

describe('List classes service', () => {
  let listClassesService: ListClassesService;

  beforeEach(() => {
    listClassesService = ListClassesService.getInstance(mockClasseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listClassesService).toBeDefined();
  });

  it('should list users class', async () => {
    const first_classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title_1',
      user_id: 'any_user_id',
    });

    const second_classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title_2',
      user_id: 'any_user_id',
    });

    mockClasseRepository.list = rightResponse({
      data: [first_classe, second_classe],
      total: 2,
      limit: 10,
      page: 1,
    });

    const classeCreated = await listClassesService.execute({
      user_id: 'any_user_id',
    });

    const data = classeCreated.map((user) => user.data);

    expect(classeCreated.isRight()).toBeTruthy();
    expect(data).toHaveLength(2);
    expect(data[0].id).toBeDefined();
  });
});
