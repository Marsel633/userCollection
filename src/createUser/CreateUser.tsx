import { Button } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { db } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import { fetchUsers } from "../userList/userListSlice";
import { useAppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface IUseFormValues {
  name: string;
  email: string;
  age: number;
}

const schema = yup
  .object()
  .shape({
    name: yup.string().required("Введите имя"),
    email: yup
      .string()
      .email("Введите корректную почту")
      .required("Введите почту"),
    age: yup
      .number()
      .typeError("Введите корректный возраст")
      .positive("Возраст должен быть больше нуля")
      .integer("Возраст должен быть целым числом")
      .required("Введите возраст"),
  })
  .required();

export const CreateUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<IUseFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: IUseFormValues) => {
    console.log("данные", data);
    console.log(import.meta.env.VITE_FIREBASE_API_KEY);
    try {
      await addDoc(collection(db, "users"), data);
      toast.success("Пользователь успешно добавлен!");
      dispatch(fetchUsers());
      reset();
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Ошибка при добавлении пользователя");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Добавить пользователя</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Имя</label>
          <input {...register("name")} />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </div>
        <div>
          <label>Возраст</label>
          <input type="number" {...register("age")} />
          <p style={{ color: "red" }}>{errors.age?.message}</p>
        </div>
        <div>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </div>
      </form>
    </div>
  );
};
