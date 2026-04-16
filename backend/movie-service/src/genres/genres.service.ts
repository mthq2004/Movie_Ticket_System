import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return this.genreRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateGenreDto): Promise<Genre> {
    const existing = await this.genreRepo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Thể loại đã tồn tại');
    const genre = this.genreRepo.create(dto);
    return this.genreRepo.save(genre);
  }

  async remove(id: number): Promise<void> {
    await this.genreRepo.delete(id);
  }
  async update(id: number, dto: Partial<CreateGenreDto>): Promise<Genre> {
    // preload sẽ tìm bản ghi theo ID và merge với dữ liệu trong dto
    const genre = await this.genreRepo.preload({
        id: id, // Phải có id ở đây để TypeORM biết bản ghi nào cần cập nhật
        ...dto,
    });

    // Nếu id không tồn tại trong DB, preload trả về undefined
    if (!genre) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    // Lưu và trả về bản ghi (save sẽ trả về đúng kiểu Genre)
    return this.genreRepo.save(genre);
    }
}
