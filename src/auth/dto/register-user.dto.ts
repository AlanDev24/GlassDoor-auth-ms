import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

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
}
