export interface UseCaseBlob<S, T> {

    execute(params: S): Promise<T>;

}