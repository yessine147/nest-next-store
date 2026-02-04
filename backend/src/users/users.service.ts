import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    const passwordHash = await hash(password, 10);
    const user = this.usersRepository.create({ email, passwordHash });
    return this.usersRepository.save(user);
  }

  async assertEmailNotTaken(email: string): Promise<void> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new NotFoundException('Email is already in use');
    }
  }
}
