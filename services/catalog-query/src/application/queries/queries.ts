export class GetPortfolioQuery {
  constructor(public readonly category?: string) {}
}

export class GetProjectQuery {
  constructor(public readonly slug: string) {}
}

export class ListResourceQuery {
  constructor(public readonly resource: string) {}
}
