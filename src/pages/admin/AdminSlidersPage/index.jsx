import React, { useState, useEffect } from "react";
import { useSliders } from "@/queries/slidersQueries";
import { useDeleteSliderMutation } from "@/mutations/useDeleteSliderMutation";
import { useReorderSlidersMutation } from "@/mutations/useReorderSlidersMutation";
import AddSliderDialog from "@/components/admin/sliders/AddSliderDialog";
import EditSliderDialog from "@/components/admin/sliders/EditSliderDialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Reorder, useDragControls } from "framer-motion";
import { Trash2, GripVertical, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSlidersPage = () => {
  const { data, isLoading, isError } = useSliders();
  const slidersData = data?.data ?? [];
  const [items, setItems] = useState([]);

  const { mutate: deleteSlider } = useDeleteSliderMutation();
  const { mutate: reorderSliders } = useReorderSlidersMutation();

  useEffect(() => {
    if (slidersData.length > 0) {
      setItems(slidersData.sort((a, b) => a.orderIndex - b.orderIndex));
    }
  }, [slidersData]);

  const handleReorder = (newItems) => {
    setItems(newItems);
    // Prepare data for backend: an array of { id, orderIndex }
    const updatedOrder = newItems.map((item, index) => ({
      id: item._id,
      orderIndex: index,
    }));

    reorderSliders({ sliders: updatedOrder });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      deleteSlider(id, {
        onSuccess: () => toast.success("Slider deleted successfully"),
        onError: () => toast.error("Failed to delete slider"),
      });
    }
  };

  return (
    <div className="bg-[#F9F9FF] min-h-screen p-6 md:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col lg:flex-row gap-6 justify-between lg:items-end bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <p className="uppercase text-[#3525CD] text-[10px] font-bold tracking-[2px] font-['Inter'] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#3525CD]"></span>
            Interface Customization
          </p>
          <h1 className="text-[#141B2B] text-[40px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
            Sliders Management
          </h1>
          <p className="max-w-xl text-[#464555] text-base font-medium leading-relaxed font-['Inter'] opacity-80">
            Control your homepage visual identity. Drag and drop sliders to
            reorder their appearance priority on the main landing page.
          </p>
        </div>
        <AddSliderDialog />
      </header>

      {/* Body */}
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="w-full py-20 flex flex-col justify-center items-center gap-4 bg-white rounded-3xl border border-dashed border-gray-200">
            <Spinner className="size-10 border-[#3525CD]" />
            <p className="text-gray-400 font-bold animate-pulse">
              Fetching sliders...
            </p>
          </div>
        ) : isError ? (
          <Empty className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <EmptyHeader>
              <EmptyTitle className="text-red-500">Connection Error</EmptyTitle>
              <EmptyDescription>
                We couldn't retrieve the sliders. Please check your network or
                try again later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 gap-6">
            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center">
              <EyeOff className="size-10 text-gray-300" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                No sliders found
              </h3>
              <p className="text-gray-500">
                Your homepage is currently waiting for some visual magic.
              </p>
            </div>
            <AddSliderDialog />
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {items.map((slider) => (
              <SliderItem
                key={slider._id}
                slider={slider}
                onDelete={() => handleDelete(slider._id)}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Helper Legend */}
      {items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <p className="text-xs text-gray-400 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm font-medium">
            <GripVertical className="size-3" /> Tip: Drag the handle on the left
            to reorder
          </p>
        </div>
      )}
    </div>
  );
};

const SliderItem = ({ slider, onDelete }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={slider}
      dragListener={false}
      dragControls={controls}
      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow group relative"
    >
      {/* Drag Handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#3525CD] transition-colors"
      >
        <GripVertical className="size-5" />
      </div>

      {/* Image Preview */}
      <div className="relative w-40 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
        <img
          src={
            slider.imageUrl.startsWith("http")
              ? slider.imageUrl
              : `http://localhost:5000${slider.imageUrl}`
          }
          alt={slider.title}
          className="w-full h-full object-cover"
        />
        {!slider.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/30 font-bold uppercase tracking-wider">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {slider.title}
          </h3>
          {slider.isActive ? (
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-gray-300" />
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-1 mb-2 font-medium">
          {slider.description || "No description provided"}
        </p>
        <div className="flex items-center gap-4">
          {slider.linkUrl && (
            <a
              href={slider.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#3525CD] flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="size-3" />{" "}
              {slider.buttonText || "Learn More"}
            </a>
          )}
          <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            Order: {slider.orderIndex}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <EditSliderDialog slider={slider} />
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default AdminSlidersPage;
