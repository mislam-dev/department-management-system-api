import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedError = errors.map((err) => {
      return {
        field: err.property,
        values: Object.values(err.constraints || {}),
      };
    });
    return new BadRequestException({
      status: 400,
      message: 'validation failed!',
      errors: formattedError,
    });
  },
});
