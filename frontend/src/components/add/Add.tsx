import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type BaseFormData = {
  img: string;
};

type UserFormData = BaseFormData & {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verified: boolean;
};

type ProductFormData = BaseFormData & {
  title: string;
  color: string;
  price: string;
  producer: string;
  inStock: boolean;
};

type FormData = UserFormData | ProductFormData;

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const getInitialState = (): FormData => {
    if (props.slug === "user") {
      return {
        img: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        verified: false,
      } as UserFormData;
    }
    return {
      img: "",
      title: "",
      color: "",
      producer: "",
      price: "",
      inStock: false,
    } as ProductFormData;
  };

  const [formData, setFormData] = useState<FormData>(getInitialState());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const mutation = useMutation<FormData[], Error, FormData>({
    mutationFn: async (data) => {
      const response = await fetch(`http://localhost:8800/api/${props.slug}s`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`all${props.slug}s`] });
      props.setOpen(false);
    },
    onError: (error) => {
      console.error("Error adding item:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add item. Please try again.",
      }));
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (!value.trim() && key !== "img") {
          newErrors[key] = "This field is required";
        }
        if (key === "email" && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[key] = "Please enter a valid email";
        }
        if (key === "price" && value && isNaN(Number(value.replace("$", "")))) {
          newErrors[key] = "Please enter a valid price";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format price with $ if it's a product
    if (
      props.slug === "product" &&
      "price" in formData &&
      !formData.price.startsWith("$")
    ) {
      mutation.mutate({
        ...formData,
        price: `$${formData.price}`,
      } as ProductFormData);
    } else {
      mutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className='add'>
      <div className='modal'>
        <span className='close' onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "createdAt")
            .map((column) => (
              <div
                className={`item ${
                  column.type === "boolean" ? "checkbox-item" : ""
                }`}
                key={column.field}
              >
                <label htmlFor={column.field}>{column.headerName}</label>
                <input
                  id={column.field}
                  type={
                    column.type === "boolean"
                      ? "checkbox"
                      : column.type === "number"
                      ? "number"
                      : column.field === "email"
                      ? "email"
                      : column.field === "img"
                      ? "url"
                      : "text"
                  }
                  placeholder={
                    column.type === "boolean" ? undefined : column.field
                  }
                  name={column.field}
                  onChange={handleChange}
                  checked={
                    column.type === "boolean"
                      ? Boolean(formData[column.field as keyof FormData])
                      : undefined
                  }
                  value={
                    column.type !== "boolean"
                      ? String(formData[column.field as keyof FormData] || "")
                      : undefined
                  }
                />
                {errors[column.field] && (
                  <span className='error'>{errors[column.field]}</span>
                )}
              </div>
            ))}
          {errors.submit && (
            <div className='error submit-error'>{errors.submit}</div>
          )}
          <button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
