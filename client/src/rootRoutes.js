import { combineRouteSwitchers } from './utils';
import {
  routesMap as videosRoutesMap,
  routeSwitcher as videosRouteSwitcher
} from './videos';

export const routesMap = { 
  ...videosRoutesMap,
};

export const rootRouteSwitcher = combineRouteSwitchers(
  videosRouteSwitcher,
);
