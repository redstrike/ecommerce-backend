import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { User } from './domain/user.entity'
import { UsersService } from './users.service'

import { UsersController } from './users.controller'

@Module({
	imports: [MikroOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService], // Export UsersService for use in other modules (e.g., AuthModule)
})
export class UsersModule {}
