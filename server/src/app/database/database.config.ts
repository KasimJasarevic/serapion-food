import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions() {
    const db = this.configService.get('database');
    // fs.writeFileSync('ormconfig.json', JSON.stringify(db, null, 2));
    return db;
  }
}
