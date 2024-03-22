import { useCallback } from "react";

import useStore from "../stores/store";
import { CreateImage, Image } from "../types";
import useMutation from "./useMutation";

interface UseCreateImageOptions {
  onSuccess?: (data: Image) => void;
}

const useCreateImage = (options?: UseCreateImageOptions) => {
  const create = useStore((store) => store.images.create);
  const mutationFn = useCallback(
    (payload: CreateImage) => create(payload),
    [create],
  );
  const { isError, isLoading, mutate, status } = useMutation({
    mutationFn,
    onSuccess: options?.onSuccess,
  });

  return {
    createImage: mutate,
    isError,
    isLoading,
    status,
  };
};

export default useCreateImage;
