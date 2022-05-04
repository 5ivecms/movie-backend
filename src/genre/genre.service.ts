import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateGenreDto, UpdateGenreDto } from './dto'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
  constructor(@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>) {}

  public async bySlug(slug: string) {
    const genre = await this.genreModel.findOne({ slug }).exec()

    if (!genre) {
      throw new NotFoundException('Genre not found')
    }

    return genre
  }

  public async byId(_id: string) {
    const genre = await this.genreModel.findById(_id)

    if (!genre) {
      throw new NotFoundException('Genre not found')
    }

    return genre
  }

  public async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.genreModel.find(options).select('-updatedAt -__v').sort({ createdAt: 'desc' }).exec()
  }

  public async getCollections() {
    const genres = await this.getAll()
    const collections = genres
    return collections
  }

  public async update(_id: string, dto: UpdateGenreDto) {
    const updatedGenre = await this.genreModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec()

    if (!updatedGenre) {
      throw new NotFoundException('Genre not found')
    }

    return updatedGenre
  }

  public async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    }

    const genre = await this.genreModel.create(defaultValue)

    return genre._id
  }

  public async delete(id: string) {
    const deletedGenre = this.genreModel.findByIdAndDelete(id).exec()

    if (!deletedGenre) {
      throw new NotFoundException('Genre not found')
    }

    return deletedGenre
  }
}
