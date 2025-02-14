
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { ValidRoles } from '../interfaces';


export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('MX',
    {
      message:
        'Insert a valid phone number.',
    },
  )
  @MinLength(10)
  phoneNumber: string

  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must have 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
    },
  )
  password: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsEnum(ValidRoles, { each: true })
  roles?: ValidRoles[];
}
