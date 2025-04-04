import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, InputNumber } from "antd";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers } from "../userList/userListSlice";
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
  const { users } = useAppSelector((state) => state.users);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    age: number;
  } | null>(null);

  useEffect(() => {
    const foundUser = users.find((user) => user.id === id);
    if (foundUser) {
      setUser(foundUser);
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, id, users]);

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
    console.log(values);
    if (user) {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        name: values.name,
        email: values.email,
        age: values.age,
      });
      navigate("/");
    }
    toast.success("Данные успешно обновлены!")
  };

  if (!user) {
    return <p>Загрузка...</p>;
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
            render={({ field }) => <Input {...field} placeholder={user.name} />}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>Почта</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={user.email} />
            )}
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
              <InputNumber
                {...field}
                min={0}
                defaultValue={user.age}
                style={{ width: "100%" }}
              />
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
