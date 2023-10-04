import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('search_keyword')
export class Keywords {
  @PrimaryGeneratedColumn()
  id_keyword: number;

  @Column()
  keyword_name: string;

  @Column()
  created_by: string;

  @Column()
  created_date: Date;
}
