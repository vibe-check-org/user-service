import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('VibeSkillScoreInput')
export class VibeSkillScore {
  @Field()
  kategorie: string;

  @Field()
  punkte: number;
}
