import { SetMetadata } from '@nestjs/common';

export const MODULE_KEY = 'module';
export const RequiredModule = (moduleName: string) => SetMetadata(MODULE_KEY, moduleName);

