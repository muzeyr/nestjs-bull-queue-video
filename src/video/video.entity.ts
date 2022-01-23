import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate, Binary } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('video')
export class VideoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({default: ''})
  path: string;

  @Column({default: ''})
  jobId: string;

  @Column({default: ''})
  size: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  jobStart: Date;

  @Column({ type: 'timestamp'})
  jobEnd: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @ManyToOne(type => UserEntity, user => user.videos)
  author: UserEntity;
}