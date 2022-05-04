import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  public async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto)
  }

  @Get('count')
  @Auth('admin')
  public async getCountUsers() {
    return this.userService.getCount()
  }

  @Get()
  @Auth('admin')
  public async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  public async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  public async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  public async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.delete(id)
  }
}
