import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        scheme: configService.get('NEO4J_SCHEME') || 'neo4j',
        host: configService.get('NEO4J_HOST') || '127.0.0.1',
        port: configService.get('NEO4J_PORT') || 7687,
        username: configService.get('NEO4J_USERNAME') || 'neo4j',
        password: configService.get('NEO4J_PASSWORD') || 'ikhaatkaas',
        database: configService.get('NEO4J_DATABASE') || 'neo4j',
      })
    })
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule { }
