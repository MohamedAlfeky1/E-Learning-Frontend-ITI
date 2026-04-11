import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AssetCard from "./AssetCard";
import "./style.css";

const UploadingCard = () => {
  return (
    <Card className="px-4 py-8 uploading-card-bg-color ring-0">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary" className="advanced-badge rounded font-bold">
            7 ACTIVE
          </Badge>
        </CardAction>
        <CardTitle className="font-bold font-plus-jakarta">
          Uploading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <AssetCard />
          <AssetCard />
          <AssetCard />
          <AssetCard />
          <AssetCard />
          <AssetCard />
          <AssetCard />
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UploadingCard;
