import CourseCard from "@/components/student/cart/CourseCard";
import OrderSummary from "@/components/student/cart/OrderSummary";
import { useCart } from "@/queries/cartQueries";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    refetch,
  } = useCart();
  const cartObject = cartData?.data || {};
  const cartItems = cartObject?.cart?.items || [];

  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <p className="uppercase text-[#3525CD] text-[10px] font-bold tracking-[2px] font-['Inter'] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#3525CD]"></span>
            Checkout Process
          </p>
          <h1 className="text-[#141B2B] text-[40px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
            Review Your <span className="text-[#3525CD]">Cart</span>
          </h1>
          <p className="text-[#464555] text-sm font-medium opacity-80 font-['Inter']">
            You have {cartItems.length} items in your shopping cart.
          </p>
        </div>
      </header>

      {cartLoading ? (
        <div className="flex justify-center items-center gap-3">
          <Spinner className="size-8" /> Loading cart...
        </div>
      ) : cartError ? (
        <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
          <EmptyHeader>
            <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
              Unable to load cart.
            </EmptyTitle>
            <EmptyDescription className="text-base font-medium text-[#464555] opacity-70">
              An error happened while fetching cart items from server.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button
              className="px-8 h-12 bg-[#3525CD] text-white rounded-xl font-bold"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </EmptyContent>
        </Empty>
      ) : !cartItems.length ? (
        <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
          <EmptyHeader>
            <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
              Cart is Empty
            </EmptyTitle>
            <EmptyDescription className="text-base font-medium text-[#464555] opacity-70 max-w-md mx-auto">
              You haven't added any courses to your cart yet. Explore our course
              catalog and start learning today!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Link to={"/courses"}>
              <Button className="px-8 h-12 bg-[#3525CD] text-white rounded-xl font-bold">
                Explore Courses
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="flex flex-col xl:flex-row gap-8">
          {/* <section className="grid grid-cols-1 lg:grid-cols-4 gap-8"> */}
          <div className="xl:flex-3 rounded-[24px] flex flex-col gap-4">
            {/* <div className="lg:col-span-3 rounded-[24px] flex flex-col gap-4"> */}
            {cartItems.map((item) => (
              <CourseCard key={item._id} course={item.courseId} />
            ))}
          </div>
          <OrderSummary cart={cartObject} />
        </section>
      )}
      </div>
    </div>
  );
};

export default CartPage;
