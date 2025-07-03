import { CreateAdresseInput } from './create-item.input.js';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export type Benutzerrolle = 'BEWERBER' | 'RECRUITER' | 'ADMIN';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  vorname: string;

  @Field()
  @IsString()
  nachname: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  geburtsdatum?: Date;

  //   @Field({ nullable: true })
  //   @IsOptional()
  //   profilbildUrl?: string;

  @Field()
  @IsString()
  organisation: string;

  @Field(() => String)
  @IsEnum(['BEWERBER', 'RECRUITER', 'ADMIN'])
  rolle: Benutzerrolle;

  @Field(() => [CreateAdresseInput], { nullable: true })
  @IsOptional()
  adressen?: CreateAdresseInput[];
}
