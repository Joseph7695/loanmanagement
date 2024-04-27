export const jwtConstants = {
  secret: '}4>V8MTAf":FhX?M$bO)@*@}7AWcAzFCcU1[I9EfHabkQ7$B)6.U%dA]ZPz=yX{',
};
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
