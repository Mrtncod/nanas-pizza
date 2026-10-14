import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteItem } from "./cartSlice";

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();

  function handleDelete() {
    dispatch(deleteItem(pizzaId));
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-tomato-600/10 text-tomato-600 transition-all duration-200 hover:bg-tomato-600/20 hover:text-tomato-700"
      aria-label="Remove pizza from order"
      title="Remove from order"
    >
      <Trash2 size={16} strokeWidth={2} />
    </button>
  );
}

export default DeleteItem;
