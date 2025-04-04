import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, InputNumber, Spin } from "antd";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserById, updateUser } from "../userList/userListSlice";
import { toast } from "react-toastify";

interface IFormInputs {
  name: string;
  email: string;
  age: number;
}

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector((state) => state.users);
  const user = users.find((user) => user.id === id);

  useEffect(() => {
    if (!user && id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id, user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInputs>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("age", user.age);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<IFormInputs> = async (values) => {
    if (id) {
      await dispatch(updateUser({ id, ...values }));
      toast.success("Данные успешно обновлены!");
      navigate("/");
    }
  };

  if (status === "loading") {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Редактировать пользователя</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
        <div>
          <label>Имя</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>Почта</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Возраст</label>
          <Controller
            name="age"
            control={control}
            rules={{ required: "Пожалуйста, введите возраст!", min: 0 }}
            render={({ field }) => (
              <InputNumber {...field} min={0} style={{ width: "100%" }} />
            )}
          />
          {errors.age && <p>{errors.age.message}</p>}
        </div>
        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Сохранить
        </Button>
      </form>
      <Button onClick={() => navigate("/")} style={{ marginTop: 16 }}>
        Отменить
      </Button>
    </div>
  );
};
