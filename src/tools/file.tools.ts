import { AnyValue, FnWithArg, Optional } from '../types';

export const imageEncoder = (file: AnyValue, callback: FnWithArg<Optional<string | ArrayBuffer>>) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onloadend = () => {
    callback(reader.result);
  };
};
