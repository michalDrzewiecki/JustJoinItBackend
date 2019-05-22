import { IsString, IsNumber } from 'class-validator';

export class UpdateOfferDto {
  @IsString()
  public routingTag: string;

  @IsNumber()
  public yCoordinate: number;

  @IsNumber()
  public xCoordinate: number;
}
