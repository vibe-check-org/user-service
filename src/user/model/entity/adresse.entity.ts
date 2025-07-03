import { type User } from './user.entity.js';
import { User as UserClass } from './user.entity.js';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
@ObjectType('Adresse')
export class Adresse {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column()
  strasse: string;

  @Field()
  @Column()
  plz: string;

  @Field()
  @Column()
  ort: string;

  @Field({ nullable: true })
  @Column()
  land: string;

  @ManyToOne(() => UserClass, (user) => user.adressen)
  user: User;
}
