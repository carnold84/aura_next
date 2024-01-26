import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { CreateImage } from "../../api/types";
import useCreateImage from "../../hooks/useCreateImage";
import useImages from "../../hooks/useImages";

const Images = () => {
  const { createImage } = useCreateImage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateImage>();
  const onSubmit: SubmitHandler<CreateImage> = (data: CreateImage) => {
    createImage(data);
  };

  return (
    <div>
      <div>
        <h1>Images</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={"Test"}
            {...register("name", { required: true })}
          />
          {errors.name && <span>This field is required</span>}
          <label htmlFor="url">Url</label>
          <input
            type="text"
            value={
              "https://cdn.dribbble.com/userupload/12464741/file/original-a2c0b32ef331ea9e2a0df25893c5a4d8.png?resize=1024x768"
            }
            {...register("url", { required: true })}
          />
          {errors.url && <span>This field is required</span>}
          <button type="submit">Create</button>
        </form>
      </div>
      <ImagesList />
    </div>
  );
};

const ImagesList = () => {
  const { data, isError, isLoading } = useImages();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>An error occurred.</p>;
  }

  if (data?.length === 0) {
    return <p>You don't have any images.</p>;
  }

  return data?.map(({ id, name }) => {
    return (
      <li>
        <Link key={id} to={id}>
          {name}
        </Link>
      </li>
    );
  });
};

export default Images;
