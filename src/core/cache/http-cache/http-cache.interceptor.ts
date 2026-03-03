/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const requestMethod = httpAdapter.getRequestMethod(request);
    if (requestMethod !== 'GET') {
      return undefined;
    }

    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (cacheMetadata) {
      return cacheMetadata;
    }

    const url: string = httpAdapter.getRequestUrl(request);

    const [path, queryString] = url.split('?');

    const cleanPath = path.replace(/^\/|\/$/g, '').replace(/\//g, ':');

    // 2. Predictable Query: Sort the keys so order doesn't matter
    let cleanQuery = '';
    if (queryString) {
      const params = new URLSearchParams(queryString);
      params.sort(); // <-- This is the secret sauce
      cleanQuery =
        '-' + params.toString().replace(/&/g, '-').replace(/=/g, ':');
    }

    return `${cleanPath}${cleanQuery}`;
  }
}
