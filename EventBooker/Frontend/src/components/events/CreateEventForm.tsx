import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { eventsService } from "../../services/events";
import { QUERY_KEYS, ROUTES } from "../../utils/constants";
import LoadingSpinner from "../common/LoadingSpinner";

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Must be a valid URL"),
});

const getMinDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventFormProps {
  initialValues?: Partial<CreateEventFormData>;
  onSubmitSuccess?: () => void;
  isEdit?: boolean;
  eventId?: string;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  initialValues,
  onSubmitSuccess,
  isEdit = false,
  eventId,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: initialValues,
  });

  // Reset form when initialValues change (for edit)
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const createEventMutation = useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      onSubmitSuccess?.();
      navigate(ROUTES.ADMIN_DASHBOARD);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: (data: CreateEventFormData) =>
      eventsService.updateEvent(eventId!, data),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      onSubmitSuccess?.();
      navigate(ROUTES.ADMIN_DASHBOARD);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });

  const onSubmit = (data: CreateEventFormData) => {
    const eventData = {
      ...data,
      maxCapacity: data.capacity,
    };
    if (isEdit && eventId) {
      updateEventMutation.mutate(eventData);
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            {...register("title")}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter event title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="Describe your event"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date & Time
            </label>
            <input
              {...register("date")}
              type="datetime-local"
              min={getMinDateTime()}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              {...register("location")}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Event location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Ticket Price ($)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Capacity
            </label>
            <input
              {...register("capacity", { valueAsNumber: true })}
              type="number"
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Maximum attendees"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            {...register("imageUrl")}
            type="url"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isEdit
                ? updateEventMutation.isPending
                : createEventMutation.isPending
            }
            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {(
              isEdit
                ? updateEventMutation.isPending
                : createEventMutation.isPending
            ) ? (
              <LoadingSpinner size="sm" />
            ) : isEdit ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
