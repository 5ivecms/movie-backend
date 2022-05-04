import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { IdValidationPipe } from 'src/pipes'
import { CreateGenreDto } from './dto'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  public async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug)
  }

  @Get('/collections')
  public async getCollections() {
    return this.genreService.getCollections()
  }

  @Get()
  public async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  public async byId(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  public async update(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateGenreDto) {
    return this.genreService.update(id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  public async create() {
    return this.genreService.create()
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  public async delete(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.delete(id)
  }
}
