import { AppState } from '@/lib/store';
import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default useAppSelector;
