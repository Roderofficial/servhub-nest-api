import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * App controller
 * @category Controllers
 * @class AppController
 * @export
 * @constructor
 * @param {AppService} appService  The app service
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
