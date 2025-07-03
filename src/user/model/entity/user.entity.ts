import { Adresse } from './adresse.entity.js';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { VibeProfil } from './profile.entity.js';

// Benutzerrollen auf Deutsch
export type Benutzerrolle = 'BEWERBER' | 'RECRUITER' | 'ADMIN';

@ObjectType('User')
@Entity({ name: 'user' }) // Tabellenname: "user"
export class User {
  @PrimaryColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'username' })
  @Field()
  name: string;

  @Column()
  @Field()
  vorname: string;

  @Column()
  @Field()
  nachname: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  geburtsdatum?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  profilbildUrl?: string;

  @Column({
    type: 'enum',
    enum: ['BEWERBER', 'RECRUITER', 'ADMIN'],
    default: 'BEWERBER',
  })
  @Field()
  rolle: Benutzerrolle;

  @OneToMany(() => Adresse, (adresse) => adresse.user, { cascade: true })
  @Field(() => [Adresse], { nullable: true })
  adressen: Adresse[];

  @OneToOne(() => VibeProfil, (profil) => profil.user, {
    cascade: true,
    eager: true, // optional, falls direkt mitladen gewünscht
  })
  @Field(() => VibeProfil, { nullable: true })
  profile: VibeProfil;

  @CreateDateColumn()
  @Field()
  erstelltAm: Date;

  @UpdateDateColumn()
  @Field()
  aktualisiertAm: Date;
}
