import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModel } from 'src/user/user.model'
import { JwtModule } from '@nestjs/jwt'
import { getJWTConfig } from 'src/config/jwt.config'
import { JwtStrategy } from './strategies'

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
