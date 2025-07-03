import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
    @Field(() => String, { nullable: true })
    vorname?: string;

    @Field(() => String, { nullable: true })
    nachname?: string;

    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    geburtsdatum?: string;

    @Field(() => String, { nullable: true })
    organisation?: string;

    @Field(() => String, { nullable: true })
    rolle?: string;
}


@InputType()
export class UpdatePasswordInput {
    @Field()
    id: string;

    @Field()
    newPassword: string;
}
