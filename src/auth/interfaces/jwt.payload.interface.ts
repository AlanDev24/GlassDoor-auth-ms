import { ValidRoles } from './valid-roles';

export interface JwtPaylaod {
  email: string;
  isActive: boolean;
  roles: ValidRoles[];
}
