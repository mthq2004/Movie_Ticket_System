import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const SERVICES = {
  user: 'http://172.28.108.173:8081',
  movie: 'http://172.28.108.173:8082',
  booking: 'http://172.28.108.173:8083',
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
