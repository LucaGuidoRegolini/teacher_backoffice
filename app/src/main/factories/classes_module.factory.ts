import { CreateClassesController } from '@modules/classes/controllers/create_classes.controller';
import { DeleteClassesController } from '@modules/classes/controllers/delete_classes.controller';
import { UpdateClassesController } from '@modules/classes/controllers/update_classes.controller';
import { ListClassesController } from '@modules/classes/controllers/list_classes.controller';
import { CreateClassesService } from '@modules/classes/services/create_classes.service';
import { DeleteClassesService } from '@modules/classes/services/delete_classes.service';
import { UpdateClassesService } from '@modules/classes/services/update_classes.service';
import { ListClassesService } from '@modules/classes/services/list_classes.service';
import { classeRepositoryFactory } from './repositories.factory';

export function createClassesServiceFactory(): CreateClassesService {
  return CreateClassesService.getInstance(classeRepositoryFactory());
}

export function createClassesControllerFactory(): CreateClassesController {
  return CreateClassesController.getInstance(createClassesServiceFactory());
}

export function updateClassesServiceFactory(): UpdateClassesService {
  return UpdateClassesService.getInstance(classeRepositoryFactory());
}

export function updateClassesControllerFactory(): UpdateClassesController {
  return UpdateClassesController.getInstance(updateClassesServiceFactory());
}

export function deleteClassesServiceFactory(): DeleteClassesService {
  return DeleteClassesService.getInstance(classeRepositoryFactory());
}

export function deleteClassesControllerFactory(): DeleteClassesController {
  return DeleteClassesController.getInstance(deleteClassesServiceFactory());
}

export function listClassesServiceFactory(): ListClassesService {
  return ListClassesService.getInstance(classeRepositoryFactory());
}

export function listClassesControllerFactory(): ListClassesController {
  return ListClassesController.getInstance(listClassesServiceFactory());
}
