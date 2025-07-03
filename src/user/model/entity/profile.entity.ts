/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { VibeSkillScore } from './vibe-skill-score.entity.js';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { User } from './user.entity.js';
import { User as UserClass } from './user.entity.js';

@ObjectType('vibe_profile')
@Entity({ name: 'vibe_profile' })
export class VibeProfil {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  @Field(() => [VibeSkillScore], { nullable: true })
  skills?: VibeSkillScore[];

  @CreateDateColumn()
  @Field()
  erstelltAm: Date;

  @OneToOne(() => UserClass, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User | undefined;
}
