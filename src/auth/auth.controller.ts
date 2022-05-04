import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto, RefreshTokenDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login/access-token')
  public async getTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getTokens(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }
}
