import { ValidRoles } from './valid-roles';

export interface JwtPayload {
  email: string;
  isActive: boolean;
  roles: ValidRoles[];
}
