export class CreateResourceCommand {
  constructor(
    public readonly resource: string,
    public readonly input: Record<string, unknown>,
  ) {}
}

export class UpdateResourceCommand {
  constructor(
    public readonly resource: string,
    public readonly id: string,
    public readonly input: Record<string, unknown>,
  ) {}
}

export class DeleteResourceCommand {
  constructor(
    public readonly resource: string,
    public readonly id: string,
  ) {}
}
