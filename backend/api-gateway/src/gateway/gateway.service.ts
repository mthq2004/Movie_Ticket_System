import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const SERVICES = {
  user: 'http://172.28.108.173:8081',    // máy bạn
  movie: 'http://172.28.109.10:8082',    // máy B
  booking: 'http://172.28.109.10:8083',  // máy B
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
