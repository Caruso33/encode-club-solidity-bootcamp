export class MintRequestDto {
  constructor(public address: string, public amount: number, public signature: string) {}
}
