import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import {
  MdOutlineAddShoppingCart,
  MdOutlineRemoveShoppingCart,
} from "react-icons/md";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserQuery } from "@/queries/authQueries";
import { useFavorites } from "@/queries/favoritesQueries";
import { useAddFavoriteMutation } from "@/mutations/useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "@/mutations/useDeleteFavoriteMutation";
import { useGetCartItems } from "@/queries/useCartQueries";
import { useAddToCart } from "@/mutations/cartMutations";
import {
  useEnrollmentDetailsQuery,
  useMyEnrolledCourseIds,
} from "@/queries/enrollmentQueries";
import placeholderImg from "@/assets/placeholder.jpg";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCartMutation } from "@/mutations/useDeleteCartMutation";
import { Badge } from "../ui/badge";

function CourseCard({ course }) {
  const navigate = useNavigate();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const { data: userData, isLoading: userLoading } = useUserQuery();
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useFavorites();
  const { data: cartData } = useGetCartItems();
  const { mutateAsync: addFavorite, isPending: isAddingFavorite } =
    useAddFavoriteMutation();
  const { mutateAsync: removeFavorite, isPending: isRemovingFavorite } =
    useDeleteFavoriteMutation();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useDeleteCartMutation();
  const { data: enrolledIds } = useMyEnrolledCourseIds();
  console.log("enrolledIds", enrolledIds);

  const userRole = userData?.role
  const isLoggedIn = !!userData?._id;
  const favorites = favoritesData?.data || [];
  const favorite =
    !favoritesLoading && !favoritesError
      ? favorites.find((fav) => fav?.courseId?._id === course?._id)
      : null;

  const isInCart = cartData?.data?.cart?.items?.some(
    (item) => item.courseId === course._id || item.courseId?._id === course._id,
  );
  const isAlreadyEnrolled = enrolledIds?.has(course._id) ?? false;

  const handleCartDelete = () => {
    removeFromCartMutation.mutate(course._id);
  };


  const handleProceedToCheckout = () => {
    console.log("clicked");
    navigate("/checkout-page", {
      state: {
        voucherCode: null,
      },
    });
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setOpenLoginDialog(true);
      return;
    }

    if (isAlreadyEnrolled) {
      toast.info("You are already enrolled in this course.");
      return;
    }

    if (isInCart) {
      handleCartDelete();
      return;
    }

    if (course.type === "free") {
      navigate(`/checkout-page?courseId=${course._id}`, { state: { isFreeCourse: true } })
      return;
    }

    addToCartMutation.mutate(
      { courseId: course._id },
      {
        onSuccess: () => toast.success("Course added to cart!"),
        onError: () => toast.error("Failed to add course to cart."),
      },
    );
  };
  console.log("userData", userData);

  return (
    <>
      <Link
        to={`/courses/${course._id}`}
        className="flex flex-col h-90 overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300 max-w-2xl"
      >
        {/* Thumbnail */}
        <div className="relative w-full h-64 overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={course.thumbnail || placeholderImg}
            alt="Course Thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {userData?.role === "student" && !favoritesLoading && (
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                favorite
                  ? removeFavorite(favorite._id)
                  : addFavorite(course._id);
              }}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-md hover:bg-white text-primary p-1 rounded-xl shadow-sm transition-all active:scale-90 group/heart"
            >
              {isAddingFavorite || isRemovingFavorite ? (
                <Spinner className="text-primary size-4" />
              ) : favorite ? (
                <IoHeart className="size-5 text-primary fill-primary transition-colors group-hover/heart:text-destructive group-hover/heart:fill-destructive" />
              ) : (
                <IoHeartOutline className="size-5 text-primary transition-colors group-hover/heart:text-primary" />
              )}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-5 flex-1">
          {/* Language + Rating */}
          <div className="flex items-center justify-between">
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

          {course.type === "paid" ?
            ''
            : <Badge variant="lightPruple">Free</Badge>}
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

          {/* Price + Cart */}
          <div className="flex flex-col md:flex-row items-center gap-5 mt-auto pt-2">
            {isAlreadyEnrolled ? (
              <p className="text-sm font-semibold text-green-600">
                Already Enrolled ✓
              </p>
            ) : course.type === "paid" ? (
              <div className="flex flex-row items-center justify-between gap-3 w-full">
                <p className="text-2xl font-bold text-[#3525CD]">
                  ${course.price}
                </p>

                {userRole === 'student' ? (
                  <Button
                    size="icon-sm"
                    variant="secondary"
                    className="cursor-pointer rounded-full py-3 px-3"
                    onClick={handleCartClick}
                    disabled={addToCartMutation.isPending || removeFromCartMutation.isPending}
                  >
                    {addToCartMutation.isPending || removeFromCartMutation.isPending ? (
                      <Spinner className="size-4" />
                    ) : isInCart ? (
                      <MdOutlineRemoveShoppingCart color="#3525CD" />
                    ) : (
                      <MdOutlineAddShoppingCart color="#3525CD" />
                    )}
                  </Button>
                ) : ''}

              </div>
            ) : (

              <Button
                variant="secondary"
                className="text-sm cursor-pointer py-2 px-3"
                onClick={handleCartClick}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <span className="text-sm">Enroll For Free</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </Link>

      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to enroll in this course.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="purpleBtnDefault"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CourseCard;
