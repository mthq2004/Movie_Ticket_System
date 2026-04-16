import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) throw new ConflictException('Username hoặc email đã tồn tại');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
    });
    const saved = await this.userRepo.save(user);

    // Publish event
    await this.redisService.publish('USER_REGISTERED', {
      userId: saved.id,
      username: saved.username,
      email: saved.email,
      timestamp: new Date().toISOString(),
    });
    console.log(`[EVENT] USER_REGISTERED: ${saved.username}`);

    return { message: 'Đăng ký thành công', userId: saved.id };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('Sai username hoặc password');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Sai username hoặc password');

    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
    return { access_token: token, userId: user.id, username: user.username, role: user.role };
  }

  async initAdmin(): Promise<{ message: string }> {
    const existing = await this.userRepo.findOne({ where: { username: 'admin' } });
    if (existing) return { message: 'Admin đã tồn tại (username: admin)' };
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({
      username: 'admin',
      email: 'admin@movieticket.com',
      password: hashed,
      role: 'admin',
    });
    await this.userRepo.save(admin);
    return { message: '✅ Admin đã được tạo. username: admin | password: admin123' };
  }
}
