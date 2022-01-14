import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { AddCommentDTO, CommentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private _commentsRepo: Repository<CommentEntity>,
  ) {}

  getCommentsByOrderId(orderId: number): Observable<CommentDTO[]> {
    return from(
      this._commentsRepo
        .createQueryBuilder('comment')
        .innerJoinAndSelect('comment.user', 'user')
        .innerJoinAndSelect('comment.order', 'order')
        .where('order.id = :id', { id: orderId })
        .getMany(),
    );
  }

  addNewComment(comment: AddCommentDTO) {
    return from(this._commentsRepo.create(comment).save());
  }
}
