import { SetMetadata } from '@nestjs/common';
import { AccessType } from '../../users/dtos/access-types';

export const ROLES_KEY = 'accessType';
export const Roles = (...roles: AccessType[]) => SetMetadata(ROLES_KEY, roles);