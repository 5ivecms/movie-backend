import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserModel } from 'src/user/user.model'

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>()
    const { user } = request

    if (!user.isAdmin) {
      throw new ForbiddenException('You have not rights!')
    }

    return user.isAdmin
  }
}
