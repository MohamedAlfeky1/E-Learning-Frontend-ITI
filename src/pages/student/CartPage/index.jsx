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
  } = useCart();
  const cartObject = cartData?.data || {};
  const cartItems = cartObject?.cart?.items || [];

  console.log(cartObject);

  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between">
        <h1 className="mb-2 text-dark text-[48px] font-extrabold font-plus-jakarta">
          Review Your <span style={{ color: "#712AE2" }}>Cart</span>
        </h1>
      </header>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 rounded-[24px] flex flex-col gap-4 cursor-pointer">
          {cartLoading ? (
            <div className="flex justify-center items-center gap-3">
              <Spinner className="size-8" /> Loading cart...
            </div>
          ) : !cartItems.length ? (
            <Empty className="text-center text-sm text-destructive">
              <EmptyHeader>
                <EmptyTitle className="text-4xl font-bold">
                  Cart Empty.
                </EmptyTitle>
                <EmptyDescription className="text-xl font-semibold">
                  You haven't added any courses to your cart yet. Explore our
                  course catalog and start learning today!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link to={"/courses"}>
                  <Button className="text-lg">Explore course catalog</Button>
                </Link>
              </EmptyContent>
            </Empty>
          ) : (
            cartItems.map((item) => (
              <CourseCard key={item._id} course={item.courseId} />
            ))
          )}
        </div>
        <OrderSummary total={cartObject.total} />
      </section>
    </div>
  );
};

export default CartPage;
