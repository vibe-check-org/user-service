// src/security/decorators/public.decorator.ts
import { IS_PUBLIC_KEY } from '../constants.js';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
