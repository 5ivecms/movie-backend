import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto'

import { UserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

  public async byId(_id: string) {
    const user = await this.userModel.findById(_id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  public async updateProfile(_id: string, dto: UpdateUserDto) {
    const { email, password, isAdmin } = dto
    const user = await this.byId(_id)
    const isSameUser = await this.userModel.findOne({ email })

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email busy')
    }

    if (password) {
      const salt = await genSalt(10)
      user.password = await hash(password, salt)
    }

    user.email = email

    if (isAdmin !== undefined && isAdmin === false) {
      user.isAdmin = isAdmin
    }

    await user.save()

    return
  }

  public async getCount() {
    return this.userModel.find().count().exec()
  }

  public async getAll(searchTerm: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.userModel.find(options).select('-password -updatedAt -__v').sort({ createdAt: 'desc' }).exec()
  }

  public async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec()
  }
}
