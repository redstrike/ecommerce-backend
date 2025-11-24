import { Module } from '@nestjs/common'
import { AppController } from './modules/app.controller'
import { AppService } from './modules/app.service'
import { CommonModule } from './common/common.module'

@Module({
	imports: [CommonModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
