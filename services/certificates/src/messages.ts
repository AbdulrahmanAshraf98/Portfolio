export class ListCertificatesQuery {}
export class CreateCertificateCommand {
  constructor(public readonly input: Record<string, unknown>) {}
}
export class UpdateCertificateCommand {
  constructor(
    public readonly id: string,
    public readonly input: Record<string, unknown>,
  ) {}
}
export class DeleteCertificateCommand {
  constructor(public readonly id: string) {}
}
