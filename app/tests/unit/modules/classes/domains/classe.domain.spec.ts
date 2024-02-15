import { Classe } from '@modules/classes/domains/classe.domain';

describe('classe domain', () => {
  it('should be create a classe', () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    expect(classe.title).toBe('any_title');
    expect(classe.description).toBe('any_description');
    expect(classe.date).toBeDefined();
    expect(classe.user_id).toBe('any_user_id');
    expect(classe.id).toBeDefined();
  });
  it('should be create a classe with id', () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
      id: 'any_id',
    });

    expect(classe.title).toBe('any_title');
    expect(classe.description).toBe('any_description');
    expect(classe.user_id).toBe('any_user_id');
    expect(classe.id).toBe('any_id');
  });
  it('should be change title, description and date', () => {
    const classe = new Classe({
      date: new Date(),
      description: 'any_description',
      title: 'any_title',
      user_id: 'any_user_id',
    });

    const newTitle = 'new_title';
    const newDescription = 'new_description';
    const newDate = new Date();

    classe.setTitle(newTitle);
    classe.setDescription(newDescription);
    classe.setDate(newDate);

    expect(classe.title).toBe(newTitle);
    expect(classe.description).toBe(newDescription);
    expect(classe.date).toBe(newDate);
  });
});
