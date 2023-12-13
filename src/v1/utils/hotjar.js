import { hotjar } from 'react-hotjar';

export const hotjarInit = () => {
  if (process.env.HOTJAR_ID) {
    hotjar.initialize(process.env.HOTJAR_ID, 6);
  }
};
