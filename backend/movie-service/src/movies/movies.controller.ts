import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateMovieDto>) {
    return this.moviesService.update(+id, dto);
  }
}
