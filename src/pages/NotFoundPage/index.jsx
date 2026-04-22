import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <FileQuestion className="size-8" />
          </EmptyMedia>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
          <Button
            asChild
            className="mt-4 text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Link to="/">Go back home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NotFoundPage;
