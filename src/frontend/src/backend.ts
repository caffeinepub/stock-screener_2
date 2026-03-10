// Auto-generated backend interface stub
// This file is replaced during deployment with the actual generated actor

export type Result<T, E> = { ok: T } | { err: E };

export interface backendInterface {
  fetchScreenerData(apiKey: string): Promise<Result<string, string>>;
  fetchKeyMetrics(ticker: string, apiKey: string): Promise<Result<string, string>>;
  fetchTechnicalIndicators(ticker: string, apiKey: string): Promise<Result<string, string>>;
  fetchHistoricalPrices(ticker: string, apiKey: string): Promise<Result<string, string>>;
  fetchProfiles(apiKey: string): Promise<Result<string, string>>;
}

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
  agent?: unknown;
  processError?: (e: unknown) => never;
}

export class ExternalBlob {
  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url);
  }
  constructor(private url: string) {}
  async getBytes(): Promise<Uint8Array> {
    const res = await fetch(this.url);
    return new Uint8Array(await res.arrayBuffer());
  }
  onProgress?: (percentage: number) => void;
}

export async function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions,
): Promise<backendInterface> {
  // Stub - replaced by actual generated actor
  return {} as backendInterface;
}
