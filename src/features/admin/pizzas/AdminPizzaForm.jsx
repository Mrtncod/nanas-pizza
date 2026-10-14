import { useEffect, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { useCreateAdminPizza } from "../../../hooks/useCreateAdminPizza";
import { useUpdateAdminPizza } from "../../../hooks/useUpdateAdminPizza";

function AdminPizzaForm({
  mode = "create",
  pizza = null,
  onSuccess,
  onCancel,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const isEditMode = mode === "edit";

  const createPizza = useCreateAdminPizza();
  const updatePizza = useUpdateAdminPizza();
  const mutation = isEditMode ? updatePizza : createPizza;

  const {
    register,
    handleSubmit,
    setValue,

    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: pizza?.name ?? "",
      description: pizza?.description ?? "",
      ingredients: pizza?.ingredients ?? "",
      price: pizza?.price ?? "",
      soldOut: pizza?.sold_out ?? false,
    },
  });

  // Clean up temporary blob URLs created for local image previews.
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setValue("image", null);
      setImagePreview(null);

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setValue("image", null);
      setImagePreview(null);

      return;
    }

    setValue("image", file, {
      shouldValidate: true,
    });

    // Selecting a new image means we are replacing the
    // existing image, not removing it.
    setRemoveExistingImage(false);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  function removeImage() {
    setValue("image", null);

    // In edit mode, clicking X on an existing image means:
    // "remove this image when I save."
    if (isEditMode && pizza?.image_url) {
      setRemoveExistingImage(true);
    }

    setImagePreview(null);
  }

  async function onSubmit(values) {
    try {
      if (isEditMode) {
        await updatePizza.mutateAsync({
          pizzaId: pizza.id,
          name: values.name,
          description: values.description,
          ingredients: values.ingredients,
          price: values.price,
          soldOut: values.soldOut,

          image: values.image?.[0] ?? values.image ?? null,

          removeImage: removeExistingImage,

          oldImageUrl: pizza.image_url ?? null,
        });
      } else {
        await createPizza.mutateAsync({
          pizza: {
            name: values.name,
            description: values.description,
            ingredients: values.ingredients,
            price: values.price,
            soldOut: values.soldOut,
          },
          image: values.image?.[0] ?? values.image ?? null,
        });
      }

      reset();
      setImagePreview(null);
      setRemoveExistingImage(false);

      onSuccess();
    } catch {
      // Error is displayed from the mutation.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-espresso">
          Pizza name
        </label>

        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Pizza name is required.",
            minLength: {
              value: 2,
              message: "Pizza name must be at least 2 characters.",
            },
          })}
          className="mt-2 w-full rounded-xl border border-warm-border/60 bg-white px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-warm-gray/60 focus:border-basil-600 focus:ring-2 focus:ring-basil-600/10"
          placeholder="e.g. Margherita"
        />

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-tomato-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-espresso"
        >
          Description
        </label>

        <textarea
          id="description"
          rows={3}
          {...register("description", {
            required: "Description is required.",
          })}
          className="mt-2 w-full resize-none rounded-xl border border-warm-border/60 bg-white px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-warm-gray/60 focus:border-basil-600 focus:ring-2 focus:ring-basil-600/10"
          placeholder="A short description of the pizza..."
        />

        {errors.description && (
          <p className="mt-1.5 text-xs font-medium text-tomato-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <label
          htmlFor="ingredients"
          className="text-sm font-semibold text-espresso"
        >
          Ingredients
        </label>

        <textarea
          id="ingredients"
          rows={3}
          {...register("ingredients", {
            required: "Ingredients are required.",
          })}
          className="mt-2 w-full resize-none rounded-xl border border-warm-border/60 bg-white px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-warm-gray/60 focus:border-basil-600 focus:ring-2 focus:ring-basil-600/10"
          placeholder="Tomato sauce, mozzarella, basil..."
        />

        {errors.ingredients && (
          <p className="mt-1.5 text-xs font-medium text-tomato-600">
            {errors.ingredients.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="text-sm font-semibold text-espresso">
          Price (€)
        </label>

        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register("price", {
            required: "Price is required.",
            min: {
              value: 0.01,
              message: "Price must be greater than €0.",
            },
          })}
          className="mt-2 w-full rounded-xl border border-warm-border/60 bg-white px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-warm-gray/60 focus:border-basil-600 focus:ring-2 focus:ring-basil-600/10"
          placeholder="12.00"
        />

        {errors.price && (
          <p className="mt-1.5 text-xs font-medium text-tomato-600">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div>
        <p className="text-sm font-semibold text-espresso">Pizza image</p>

        {!imagePreview ? (
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-warm-border bg-ivory/60 px-5 py-8 text-center transition hover:bg-ivory">
            <ImagePlus size={28} className="text-basil-600" />

            <span className="mt-3 text-sm font-semibold text-espresso">
              Choose an image
            </span>

            <span className="mt-1 text-xs text-warm-gray">
              JPG, PNG or WebP · Max 5 MB
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative mt-2 overflow-hidden rounded-xl">
            <img
              src={imagePreview}
              alt="Pizza preview"
              className="aspect-[4/3] w-full object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              disabled={mutation.isPending}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-espresso/80 text-white backdrop-blur-sm transition hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Remove image"
            >
              <X size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Sold out */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-ivory/70 p-4">
        <input
          type="checkbox"
          {...register("soldOut")}
          className="h-4 w-4 accent-basil-600"
        />

        <span>
          <span className="block text-sm font-semibold text-espresso">
            {isEditMode ? "Mark as sold out" : "Add as sold out"}
          </span>

          <span className="mt-0.5 block text-xs text-warm-gray">
            Customers won't be able to order this pizza.
          </span>
        </span>
      </label>

      {/* Error */}
      {mutation.error && (
        <div className="rounded-xl bg-tomato-400/10 p-4">
          <p className="text-sm font-medium text-tomato-600">
            {mutation.error.message}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 border-t border-warm-border/40 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-basil-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-basil-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              {isEditMode ? "Saving..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Save changes"
          ) : (
            "Create pizza"
          )}
        </button>
      </div>
    </form>
  );
}

export default AdminPizzaForm;
