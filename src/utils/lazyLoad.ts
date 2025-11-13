import { signal } from "fuse";

export function lazyLoad<T>(importFn: () => Promise<T>) {
  const module = signal<T | null>(null);
  const loading = signal(false);
  const error = signal<Error | null>(null);
  
  const ensureLoaded = async () => {
    if (module.get()) return module.get();
    if (loading.get()) return module.get();
    
    loading.set(true);
    error.set(null);
    
    try {
      const result = await importFn();
      module.set(result);
      return result;
    } catch (err) {
      const errorObj = err as Error;
      error.set(errorObj);
      console.error(`Lazy loading failed:`, errorObj);
      throw errorObj;
    } finally {
      loading.set(false);
    }
  };
  
  return {
    ensureLoaded,
    isLoading: () => loading.get(),
    hasLoaded: () => !!module.get(),
    hasError: () => !!error.get(),
    getError: () => error.get()?.message,
    getModule: () => module.get()
  };
}
