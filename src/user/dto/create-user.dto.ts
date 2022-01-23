import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  readonly name: string;

  readonly surname: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly passwordConfirm: string;
  
  readonly open: boolean;

  readonly rememberMe: boolean;

}