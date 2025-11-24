import { Injectable } from '@nestjs/common'

export interface ApiResponse<TOk = unknown, TError = Error> {
	success: boolean
	message?: string
	data?: TOk
	error?: TError
}

@Injectable()
export class AppService {
	getHello(): ApiResponse {
		return { success: true, message: 'Hello world!' }
	}
}
