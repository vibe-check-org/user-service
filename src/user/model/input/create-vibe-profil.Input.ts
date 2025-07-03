import { VibeSkillScore } from '../entity/vibe-skill-score.entity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateVibeProfilInput {
  @Field()
  userId: string;

  @Field(() => [VibeSkillScore])
  skills: VibeSkillScore[];
}
