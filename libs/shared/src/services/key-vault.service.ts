import { Injectable } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';

@Injectable()
export class KeyVaultService {
  private readonly client: SecretClient;
}
