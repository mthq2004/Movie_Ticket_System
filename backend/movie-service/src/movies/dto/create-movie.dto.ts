export class CreateMovieDto {
  title: string;
  description?: string;
  genre: string;
  duration: number;
  price: number;
  availableSeats?: number;
}
