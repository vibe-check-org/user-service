import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateAdresseInput {
  @Field()
  @IsString()
  strasse: string;

  @Field()
  @IsString()
  plz: string;

  @Field()
  @IsString()
  ort: string;

  @Field({ defaultValue: 'Deutschland' })
  @IsString()
  land: string;
}
