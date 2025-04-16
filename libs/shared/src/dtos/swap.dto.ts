import { IsString, IsNotEmpty } from 'class-validator';
import { NetworkName } from '../config';

export class SwapDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  network: NetworkName;
}
