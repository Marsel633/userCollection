import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "antd";
import { toast } from "react-toastify";
import { addUser } from "../userList/userListSlice";
import { useAppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface IUseFormValues {
  name: string;
  email: string;
  age: number;
}

const schema = yup.object().shape({
  name: yup.string().required("Введите корректное имя"),
  email: yup.string().email("Введите корректную почту").required("Введите корректную почту"),
  age: yup
    .number()
    .transform((_value, originalValue) => Number(originalValue) || NaN)
    .typeError("Введите корректный возраст")
    .positive("Возраст должен быть больше нуля")
    .integer("Возраст должен быть целым числом")
    .required("Введите корректный возраст"),
});

export const CreateUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IUseFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = (data: IUseFormValues) => {
    console.log("Финальные данные перед отправкой:", data);
    dispatch(addUser(data));
    reset();
    navigate("/");
    toast.success("Пользователь успешно добавлен!");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 50 }}>
      <h2>Добавить пользователя</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "30px", padding: "30px 0px" }}>
        <div>
          <label>Введите имя</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>

        <div>
          <label>Введите почту</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </div>

        <div>
          <label>Введите возраст</label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value) || "")}
              />
            )}
          />
          <p style={{ color: "red" }}>{errors.age?.message}</p>
        </div>

        <div>
          <Button type="primary" htmlType="submit">Добавить</Button>
        </div>
      </form>
      <Button onClick={() => navigate("/")}>Вернуться на главную страницу</Button>
    </div>
  );
};
