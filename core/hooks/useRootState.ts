import { useSelector } from 'react-redux';
import type { RootReducerTypes } from '../reducer';

type StateSelector<T> = (state: RootReducerTypes) => T;
type EqualityFunction<T> = (left: T, right: T) => boolean;

export default function useRootState<T>(
  selector: StateSelector<T>,
  equalityFunction?: EqualityFunction<T>
) {
  return useSelector(selector, equalityFunction);
}
