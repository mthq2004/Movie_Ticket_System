import {
  Controller,
  All,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const ROUTE_MAP: Record<string, string> = {
  '/auth': 'http://172.28.108.173:8081',   // máy bạn
  '/movies': 'http://172.28.109.10:8082',  // máy B
  '/genres': 'http://172.28.109.10:8082',  // máy B (cùng service với /movies)
  '/bookings': 'http://172.28.109.10:8083', // máy B
};

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const path = req.path;
    const targetBase = Object.entries(ROUTE_MAP).find(([prefix]) =>
      path.startsWith(prefix),
    )?.[1];

    if (!targetBase) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: `Route ${path} not found` });
    }

    try {
      const response = await firstValueFrom(
        this.http.request({
          method: req.method,
          url: `${targetBase}${path}`,
          data: req.body,
          headers: {
            'Content-Type': 'application/json',
            ...(req.headers.authorization
              ? { Authorization: req.headers.authorization }
              : {}),
          },
          params: req.query,
        }),
      );
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      const status = err.response?.status ?? HttpStatus.BAD_GATEWAY;
      const data = err.response?.data ?? { message: err.message };
      return res.status(status).json(data);
    }
  }
}
