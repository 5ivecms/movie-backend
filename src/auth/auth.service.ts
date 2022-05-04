import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { JwtService } from '@nestjs/jwt'
import { hash, genSalt, compare } from 'bcryptjs'
import { UserModel } from 'src/user/user.model'
import { AuthDto, RefreshTokenDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}

  public async login(dto: AuthDto) {
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  public async register(dto: AuthDto) {
    const { email, password } = dto

    const existUser = await this.userModel.findOne({ email })

    if (existUser) {
      throw new BadRequestException('User with this email is already in the system')
    }

    const salt = await genSalt(10)

    const newUser = new this.userModel({
      email,
      password: await hash(password, salt),
    })

    const user = await newUser.save()

    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  public async getTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException('Please sign in!')
    }

    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!')
    }

    const user = await this.userModel.findById(result._id)
    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  private async validateUser(dto: AuthDto): Promise<UserModel> {
    const { email, password } = dto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password')
    }

    return user
  }

  private async issueTokenPair(userId: string) {
    const data = { _id: userId }

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    })

    return { refreshToken, accessToken }
  }

  private returnUserFields(user: UserModel) {
    const { _id, email, isAdmin } = user
    return { _id, email, isAdmin }
  }
}
