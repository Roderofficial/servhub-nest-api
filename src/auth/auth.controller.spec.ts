import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register', () => {
    expect(controller.signup).toBeDefined();
  });

  it('validate-code', () => {
    expect(controller.validateCode).toBeDefined();
  });

  it('get-code', () => {
    expect(controller.getCode).toBeDefined();
  });
});
