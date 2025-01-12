import { ValidRoles } from "@prisma/client";


export interface JwtPaylaod {
  email: string;
  isActive: boolean;
  roles: ValidRoles[]
}
