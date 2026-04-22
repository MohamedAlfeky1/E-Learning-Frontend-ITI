import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaStar } from "react-icons/fa6";
import {
  MdOutlineAddShoppingCart,
  MdOutlineRemoveShoppingCart,
} from "react-icons/md";
import { IoEyeOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserQuery } from "@/queries/authQueries";
import { useFavorites } from "@/queries/favoritesQueries";
import { useAddFavoriteMutation } from "@/mutations/useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "@/mutations/useDeleteFavoriteMutation";
import { useCart } from "@/queries/cartQueries";
import { useAddCartMutation } from "@/mutations/useAddCartMutation";
import { useDeleteCartMutation } from "@/mutations/useDeleteCartMutation";
import placeholderImg from "@/assets/placeholder.jpg";
import { Spinner } from "../ui/spinner";
import { MdOndemandVideo, MdOutlineOndemandVideo } from "react-icons/md";

function CourseCard({ course }) {
  const { data: user } = useUserQuery();
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useFavorites();
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useCart();
  const { mutateAsync: addFavorite, isPending: isAddingFavorite } =
    useAddFavoriteMutation();
  const { mutateAsync: removeFavorite, isPending: isRemovingFavorite } =
    useDeleteFavoriteMutation();
  const { mutateAsync: addToCart, isPending: isAddingToCart } =
    useAddCartMutation();
  const { mutateAsync: removeFromCart, isPending: isRemovingFromCart } =
    useDeleteCartMutation();
  const favorites = favoritesData?.data || [];
  const cartItems = cartData?.data?.cart?.items || [];
  let favorite = null;
  let cartItem = null;

  if (!favoritesLoading && !favoritesError) {
    favorite = favorites?.find((fav) => fav?.courseId?._id === course?._id);
  }

  if (!cartLoading && !cartError) {
    cartItem = cartItems?.find((item) => item?.courseId?._id === course?._id);
  }

  return (
    <>
      <Link
        to={`/courses/${course._id}`}
        className="flex flex-col h-80 overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300 max-w-2xl"
      >
        {/* Thumbnail */}
        <div className="relative w-full h-32 overflow-hidden ">
          <img
            src={course.thumbnail || placeholderImg}
            alt="Course Thumbnail"
            className="w-full h-full object-cover"
          />
          {user?.role === "student" && !favoritesLoading && (
            <Button
              variant="primary"
              size="icon-sm"
              onClick={() =>
                favorite
                  ? removeFavorite(favorite._id)
                  : addFavorite(course._id)
              }
              className="absolute top-3 right-3 bg-gray-300 text-gray-200 p-1 rounded-full"
            >
              {isAddingFavorite || isRemovingFavorite ? (
                <Spinner className="text-red-500 size-4" />
              ) : favorite ? (
                <IoHeart color="red" />
              ) : (
                <IoHeartOutline color="red" />
              )}
            </Button>
          )}
          {/* <Link to={`/courses/${course._id}`}>
            <Button
              size="icon-sm"
              variant="primary"
              className="absolute top-3 right-3 bg-gray-300 text-gray-200 p-1 rounded-full"
            >
              <IoEyeOutline color="#3525CD" />
            </Button>
          </Link> */}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          {/* Badge + Rating */}
          <div className="flex items-center justify-between ">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-700">
              {course.language === "none" ? "" : course.language}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <FaStar color="#005523" />
              {course.totalReviews ?? "4.9"}
              <span className="text-[#005523] font-normal">
                ({course.ratingCount ?? course.totalReviews})
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {course.title}
          </h2>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-[#464555] rounded-md">
              Instructor: {course.teacherId?.firstName}{" "}
              {course.teacherId?.lastName}
            </span>
          </div>

          {/* Price + Enroll */}
          <div className="flex flex-col md:flex-row items-center gap-5 mt-auto pt-2">
            {course.type === "paid" ? (
              <div className="flex flex-row items-center justify-between gap-3 w-full">
                <p className="text-2xl font-bold text-[#3525CD]">
                  ${course.price}
                </p>
                <Button
                  size="icon-sm"
                  variant="secondary"
                  className="cursor-pointer rounded-full py-3 px-3"
                  onClick={() =>
                    cartItem
                      ? removeFromCart(course._id)
                      : addToCart(course._id)
                  }
                >
                  {isAddingToCart || isRemovingFromCart ? (
                    <Spinner className="size-4" />
                  ) : cartItem ? (
                    <MdOutlineRemoveShoppingCart color="#3525CD" />
                  ) : (
                    <MdOutlineAddShoppingCart color="#3525CD" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                size="icon-sm"
                variant="secondary"
                className="cursor-pointer rounded-full py-3 px-3"
                onClick={() =>
                  cartItem ? removeFromCart(course._id) : addToCart(course._id)
                }
              >
                {isAddingToCart || isRemovingFromCart ? (
                  <Spinner className="size-4" />
                ) : cartItem ? (
                  <MdOutlineRemoveShoppingCart color="#3525CD" />
                ) : (
                  <MdOutlineAddShoppingCart color="#3525CD" />
                )}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}

export default CourseCard;