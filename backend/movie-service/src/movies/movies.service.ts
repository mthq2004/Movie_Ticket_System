import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.movieRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepo.create({
      ...dto,
      availableSeats: dto.availableSeats ?? 100,
    });
    return this.movieRepo.save(movie);
  }
  async update(id: number, dto: Partial<CreateMovieDto>): Promise<Movie> {
    const movie = await this.movieRepo.preload({
      id: id,
      ...dto,
    });

    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }

    return this.movieRepo.save(movie);
  }
}
