import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movie.entity';
import { Genre } from './genres/genre.entity';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.28.108.173',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'movie_ticket_db',
      entities: [Movie, Genre],
      synchronize: true,
    }),
    MoviesModule,
    GenresModule,
  ],
})
export class AppModule {}

