import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('search_project')
export class Projects {
  @PrimaryGeneratedColumn()
  id_search: number;

  @Column()
  _concept_id: number ;

  @Column()
  _project_id: number;

  @Column()
  keyword_id: number;

  @Column()
  count_keyword: number;

  @Column()
  status: number;

  @Column()
  created_by: string;

  @Column()
  created_date: Date;
}
