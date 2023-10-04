import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('search_automation')
export class Automation {
  @PrimaryGeneratedColumn()
  id_automation: number;

  @Column()
  date: string;

  @Column()
  count_keyword: number;

  @Column()
  created_by: string;

  @Column()
  created_date: string;
}
