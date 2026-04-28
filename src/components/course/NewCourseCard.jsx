import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserQuery } from "@/queries/authQueries";
import { useGetCartItems } from "@/queries/useCartQueries";
import { useAddToCart } from "@/mutations/cartMutations";
import { useMyEnrolledCourseIds } from "@/queries/enrollmentQueries";
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

function NewCourseCard({ course }) {
  const navigate = useNavigate();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const { data: userData, isLoading: userLoading } = useUserQuery();
  const { data: cartData } = useGetCartItems();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useDeleteCartMutation();
  const { data: enrolledIds } = useMyEnrolledCourseIds();

  const userRole = userData?.role
  const isLoggedIn = !!userData?._id;
  const isInCart = cartData?.data?.cart?.items?.some(
    (item) => item.courseId === course._id || item.courseId?._id === course._id
  );
  const isAlreadyEnrolled = enrolledIds?.has(course._id) ?? false;

  const truncateDescription = (text, wordLimit = 8, charLimit = 50) => {
    if (!text) return "";
    if (text.includes(" ")) {
      return text.split(/\s+/).slice(0, wordLimit).join(" ");
    }
    return text.slice(0, charLimit);
  };

  const handleCartDelete = () => {
    removeFromCartMutation.mutate(
      course._id
    )
  }

  const handleProceedToCheckout = () => {
    console.log("clicked");
    navigate("/checkout-page", {
      state: {
        voucherCode: null,
      },
    });
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { courseId: course._id },
      {
        onSuccess: () => {
          navigate("/cart");
        },

      }
    );
  }

  const handleEnroll = (e) => {
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

    handleAddToCart()


  };

  const enrollLabel = () => {
    if (userLoading) return "Loading...";
    if (isAlreadyEnrolled) return "Already Enrolled ✓";
    if (isInCart) return "Remove From Cart";
    return "Enroll Now";
  };

  return (
    <>
      <Link
        to={`/courses/${course._id}`}
        className="relative h-80 flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300 max-w-2xl"
      >
        {/* Thumbnail */}
        <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          {/* Badge + Rating */}
          <div className="flex items-center gap-3">
            <Badge variant="new">New Course</Badge>
            <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <FaStar className="text-green-600 w-3.5 h-3.5" />
              {course.totalReviews ?? "4.9"}
              {course.ratingCount && (
                <span className="text-gray-400 font-normal">({course.ratingCount})</span>
              )}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {course.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed">
            {truncateDescription(course.description)}...
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            {course.teacherId?.avatar ? (
              <img
                src={course.teacherId.avatar}
                alt={course.teacherId.firstName}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                {`${course.teacherId?.firstName?.[0] || ""}${course.teacherId?.lastName?.[0] || ""}`}
              </div>
            )}
            <span className="text-sm font-medium text-[#141B2B] rounded-md px-2 py-0.5">
              Dr. {course.teacherId?.firstName} {course.teacherId?.lastName}
            </span>
          </div>

          {/* Price + Enroll */}
          <div className="flex flex-col md:flex-row items-center gap-5 mt-auto pt-2">
            {course.type === "paid" ? (
              <div className="flex flex-row items-center gap-3">
                <span className="text-2xl font-bold text-[#3525CD]">
                  ${course.price ?? "129.99"}
                </span>

                {userRole === 'student' ? (
                  <button
                    onClick={handleEnroll}
                    disabled={addToCartMutation.isPending || isAlreadyEnrolled}
                    className={`text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 ${isAlreadyEnrolled
                      ? "bg-green-600 cursor-default"
                      : "bg-indigo-600 hover:bg-[#3525CD]"
                      }`}
                  >
                    {enrollLabel()}
                  </button>
                ) : ''}

              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <Badge variant="lightPruple">Free</Badge>
                <button
                  onClick={handleEnroll}
                  disabled={addToCartMutation.isPending || isAlreadyEnrolled}
                  className={`text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 ${isAlreadyEnrolled
                    ? "bg-green-600 cursor-default"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {enrollLabel()}
                </button>
              </div>

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

export default NewCourseCard;