import { Comment } from '../comment/comment.entity';
import { Video_Tag } from '../video-tag/video-tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  filename: string;

  @Column({ nullable: false, type: 'varchar' })
  url: string;

  @Column({ nullable: false, type: 'varchar' })
  thumbnail: string;

  @AfterLoad()
  addHostUrl() {
    this.thumbnail = `${process.env.BACKEND_URL}${this.thumbnail}`;
    this.url = `${process.env.BACKEND_URL}${this.url}`;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.videos, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Video_Tag, (videoTag) => videoTag.video)
  videotags: Video_Tag[];

  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Comment[];
}
