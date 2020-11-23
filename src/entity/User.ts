import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("user")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid", { name: "id" })
    id!: string;

    @Column("varchar", { name: "email" })
    email!: string;

    @Column("varchar", { name: "password" })
    password!: string;

    @Column("varchar", { name: "first_name" })
    firstName!: string;

    @Column("varchar", { name: "last_name" })
    lastName!: string;

    @CreateDateColumn({ name: "created_on" })
    createdOn!: Date;

    @UpdateDateColumn({ name: "updated_on" })
    updatedOn!: Date;

}