import { buildFinanceModel } from './financeModels';
import { buildOperationsModel } from './operationsModels';
import { buildPeopleModel } from './peopleModels';
import { ModuleId, ModuleModel, WorkspaceData } from './types';

export function getModuleModel(
  moduleId: ModuleId,
  data: WorkspaceData,
  t?: (key: string, options?: any) => string
): ModuleModel {
  const tr = t || ((k: string) => k);
  const model =
    buildPeopleModel(moduleId, data, tr) ||
    buildOperationsModel(moduleId, data, tr) ||
    buildFinanceModel(moduleId, data, tr);

  if (!model) {
    throw new Error(`No simple page is defined for ${moduleId}`);
  }

  return model;
}
