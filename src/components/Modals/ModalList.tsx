import { useState } from "react";
import axios from "axios";
import { List } from "../../models/Models";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required()
});
type Inputs = {
  title: string;
};
export interface IModalProps {}

const ModalList = ({
  listSaved,
  modalClosed,
  list,
}: {
  listSaved: (list: List) => void;
  modalClosed: () => void;
  list: List;
}) => {
  const [, setLoading]: [boolean, (loading: boolean) => void] =
    useState<boolean>(true);
  const [, setError]: [string, (error: string) => void] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: list });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const updatedData = { ...list, ...data };
    console.log(data);
    updateData(updatedData);
  };

  function updateData(updatedList) {
    console.log(updatedList.id);
    axios
      .request({
        url:
          "https://644a97cc79279846dced2be3.mockapi.io/api/v1/list/" +
          (updatedList.id ? updatedList.id : ""),
        method: updatedList.id ? "put" : "post",
        data: {
          name: updatedList.name,
        },
      })
      .then((response) => {
        listSaved(response.data);
      })
      .catch((ex) => {
        console.error(ex);
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
        setLoading(false);
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              onClick={modalClosed}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <h3 className="text-lg font-bold">
              {list.id ? "UPDATE" : "CREATE NEW"}
            </h3>
            <p className="py-4">{list.id ? "Update list" : "Create list"} </p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name your list</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                {...register("title")}
                className="input input-bordered w-full"
              />
              <p>{errors.title?.message?.toString()}</p>
            </div>
            <button className="btn btn-success m-3" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ModalList;
