import { Report } from '@/reports/report.entity';
import { IsEmail } from 'class-validator';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]; // NOTE doesn't create a column in the database

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id: ', this.id);
  }
}
