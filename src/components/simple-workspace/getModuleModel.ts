import { buildFinanceModel } from './financeModels';
import { buildOperationsModel } from './operationsModels';
import { buildPeopleModel } from './peopleModels';
import { ModuleId, ModuleModel, WorkspaceData } from './types';

export function getModuleModel(moduleId: ModuleId, data: WorkspaceData): ModuleModel {
  const model =
    buildPeopleModel(moduleId, data) ||
    buildOperationsModel(moduleId, data) ||
    buildFinanceModel(moduleId, data);

  if (!model) {
    throw new Error(`No simple page is defined for ${moduleId}`);
  }

  return model;
}
