import CourseCard from "./CourseCard";
import OrderSummary from "./OrderSummary";
import "./style.css";
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
    <div className="min-h-screen text-white p-6 md:p-12 font-sans page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between">
        <h1 className="mb-2 text-dark text-[48px] font-extrabold font-plus-jakarta">
          Review Your <span style={{ color: "#712AE2" }}>Cart</span>
        </h1>
      </header>

      {cartLoading ? (
        <div className="flex justify-center items-center gap-3">
          <Spinner className="size-8" /> Loading cart...
        </div>
      ) : cartError ? (
        <Empty className="text-center text-sm text-destructive">
          <EmptyHeader>
            <EmptyTitle className="text-4xl font-bold">
              Unable to load cart.
            </EmptyTitle>
            <EmptyDescription className="text-xl font-semibold">
              An error happened while fetching cart items from server.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button className="text-lg" onClick={() => refetch()}>
              Try Again
            </Button>
          </EmptyContent>
        </Empty>
      ) : !cartItems.length ? (
        <Empty className="text-center text-sm text-destructive">
          <EmptyHeader>
            <EmptyTitle className="text-4xl font-bold">Cart Empty.</EmptyTitle>
            <EmptyDescription className="text-xl font-semibold">
              You haven't added any courses to your cart yet. Explore our course
              catalog and start learning today!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to={"/courses"}>
              <Button className="text-lg">Explore course catalog</Button>
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
  );
};

export default CartPage;
