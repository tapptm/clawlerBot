import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('us_project')
export class UsProjects {
  @PrimaryGeneratedColumn()
  project_id: number | string;

  @Column()
  project_name_th: string;

  @Column()
  project_name_en: string;

  @Column()
  user_idcard: number
}
