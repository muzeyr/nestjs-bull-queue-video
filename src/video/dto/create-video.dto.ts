export class CreateVideoDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly file: Express.Multer.File;
  
}
