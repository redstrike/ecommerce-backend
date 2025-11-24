import { Controller, Get } from '@nestjs/common'
import { type ApiResponse, AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	getHello(): ApiResponse {
		return this.appService.getHello()
	}
}
