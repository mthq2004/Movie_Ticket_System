import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const SERVICES = {
  user: 'http://localhost:3001',
  movie: 'http://localhost:3002',
  booking: 'http://localhost:3003',
};

@Injectable()
export class GatewayService {
  constructor(private readonly http: HttpService) {}

  async forward(service: 'user' | 'movie' | 'booking', path: string, method: string, body?: any) {
    const url = `${SERVICES[service]}${path}`;
    const response = await firstValueFrom(
      this.http.request({ method, url, data: body }),
    );
    return response.data;
  }
}
