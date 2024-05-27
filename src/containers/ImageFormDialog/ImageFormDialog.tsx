import { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog/Dialog";
import Spinner from "../../components/Spinner";
import TextField from "../../components/TextField";
import { Image } from "../../types";

export type ImageFormValues = Omit<
  Image,
  "createdAt" | "id" | "projects" | "srcUrl" | "updatedAt" | "userId"
>;

interface ImageFormDialogProps {
  children: ReactNode;
  defaultValues?: ImageFormValues;
  errorMessage?: string;
  isLoading?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: ImageFormValues) => void;
  submitBtnLabel?: string;
  successMessage?: string;
  title: string;
}

const ImageFormDialog = ({
  children,
  defaultValues,
  errorMessage,
  isLoading = false,
  onOpenChange,
  onSubmit: onSubmitProp,
  submitBtnLabel = "Save",
  successMessage,
  title,
}: ImageFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({ defaultValues });
  const onSubmit: SubmitHandler<ImageFormValues> = async (
    data: ImageFormValues,
  ) => {
    await onSubmitProp(data);
  };

  useEffect(() => {
    if (isOpen === false) {
      reset(defaultValues);
    }
  }, [defaultValues, isOpen, isLoading, reset]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onOpenChange && onOpenChange(open);
      }}
    >
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header title={title} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Body className="flex flex-col gap-3">
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
            <TextField
              disabled={isLoading}
              error={errors["name"]?.message}
              label="Image Name"
              {...register("name", { required: "Name is required" })}
            />
            <TextField
              disabled={isLoading}
              label="Description"
              {...register("description")}
            />
            <TextField disabled={isLoading} label="Url" {...register("url")} />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild={true} disabled={isLoading}>
              <Button variant="text">Cancel</Button>
            </Dialog.Close>
            <Button className="min-w-20" variant="contained" type="submit">
              {isLoading ? <Spinner size={20} /> : submitBtnLabel}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
};

export default ImageFormDialog;