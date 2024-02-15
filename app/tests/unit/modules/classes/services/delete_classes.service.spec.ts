import { DeleteClassesService } from '@modules/classes/services/delete_classes.service';
import { MockClasseRepository } from '@tests/doubles/repositories/in-memory.repository';
import { Classe } from '@modules/classes/domains/classe.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

const mockClasseRepository = MockClasseRepository.getInstance();

describe('Delete classes service', () => {
  let deleteClassesService: DeleteClassesService;

  beforeEach(() => {
    deleteClassesService = DeleteClassesService.getInstance(mockClasseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(deleteClassesService).toBeDefined();
  });

  it('should deleted a class', async () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    mockClasseRepository.delete = rightResponse(new SuccessfulResponse(classe.id));

    const classeCreated = await deleteClassesService.execute({
      classes_id: classe.id,
    });

    expect(classeCreated.isRight()).toBeTruthy();
  });
});
