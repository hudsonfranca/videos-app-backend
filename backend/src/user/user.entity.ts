import { Comment } from '../comment/comment.entity';
import { Video } from '../video/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  profilePicture: string;

  @AfterLoad()
  addHostUrl() {
    this.profilePicture = `${process.env.BACKEND_URL}${this.profilePicture}`;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
