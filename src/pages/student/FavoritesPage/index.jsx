import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart, Share2, FileText, Zap, Ruler } from "lucide-react";
import "./style.css";
import CourseCard from "./CourseCard";
import CourseImg from "../../../assets/favorites/favorite-card-thumb.jpg";

const FavoritesPage = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans favorites-page-bg">
      {/* Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="tracking-widest uppercase mb-2 text-primary text-size-xs font-weight-700 font-inter">
            Saved Content
          </p>
          <h1 className="mb-2 text-dark text-size-3xl font-weight-800 font-plus-jakarta">
            Favorites
          </h1>
          <p className="text-muted-foreground max-w-md text-secondary text-size-base font-weight-400 font-inter">
            Your curated collection of premium courses and study guides.
          </p>
        </div>
        <div className="text-right">
          <span className="text-primary text-size-xl font-weight-700 font-inter">
            12
          </span>
          <p className="uppercase text-secondary text-size-xs font-weight-700 font-inter">
            Total Items
          </p>
        </div>
      </header>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="mb-10 pb-8">
        <TabsList className="border-zinc-800 flex flex-wrap gap-2 tabs-list-bg font-weight-600">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full font-inter font-weight-600"
          >
            All Favorites
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full inactive-tab-bg font-weight-600"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full inactive-tab-bg font-weight-600"
          >
            Lessons
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full inactive-tab-bg font-weight-600"
          >
            Resources
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Featured Card */}
        <Card className="lg:col-span-2 p-0 border-none ring-0 overflow-hidden bg-white flex flex-col md:flex-row relative">
          <img src={CourseImg} className="featured-img" />
          <CardContent className="md:w-1/2 p-8 flex flex-col gap-4 justify-between md:relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-red-500"
            >
              <Heart className="fill-current" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 advanced-badge badge-base"
                >
                  ADVANCED LEVEL
                </Badge>
                <span className="text-secondary">🕒 12h 45m</span>
              </div>
              <h2 className="leading-tight mb-4 text-dark text-size-2xl font-weight-800 font-plus-jakarta">
                Quantum Physics: Beyond the Standard Model
              </h2>
              <p className="text-secondary text-size-base font-weight-400 font-inter">
                Dive deep into the mysteries of particle physics and wave
                functions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-grow continue-btn font-inter font-weight-700">
                Continue Learning
              </Button>
              <Button variant="secondary" size="icon">
                <Share2 color="#712AE2" className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Stack */}
        <div className="flex flex-col gap-6">
          <Card className="bg-indigo-50 border-none ring-0 p-4 flex flex-row items-center gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <FileText color="#712AE2" />
            </div>
            <div>
              <h4 className="font-bold text-black">Calculus Cheat Sheet</h4>
              <p className="text-xs text-zinc-500">PDF Document • 4.2 MB</p>
            </div>
          </Card>

          <Card className="flex-grow border-none ring-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between">
              <Badge className="math-badge badge-base">MATHEMATICS</Badge>
              <Heart className="text-red-500 w-5 h-5" />
            </div>
            <CardHeader className="p-0 mt-4">
              <CardTitle className="sidebar-title font-inter font-weight-600 text-size-lg">
                Multivariable Calculus Mastery
              </CardTitle>
              <p className="text-zinc-500 font-inter font-weight-400 text-size-sm">
                Master 3D graphing and partial derivatives.
              </p>
            </CardHeader>
            <Button
              variant="outline"
              className="w-full mt-6 border-2 border-indigo-100 rounded-md bg-white text-primary font-inter font-weight-700 text-size-sm"
            >
              Add to Cart • $49.00
            </Button>
          </Card>
        </div>
      </div>

      {/* Remaining Favorites */}
      <ScrollArea className="whitespace-nowrap mb-8">
        <div className="flex gap-4 py-4">
          <CourseCard className="" />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Recommended Section */}
      <Card className="bg-indigo-50 border-none ring-0 p-10 text-black recommended-section">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="max-w-md">
            <Badge
              variant="outline"
              className="text-indigo-500 border-indigo-200 mb-4 recommended-badge"
            >
              RECOMMENDED FOR YOU
            </Badge>
            <h2 className="text-3xl font-bold mb-4 recommended-title">
              Similar to your favorites
            </h2>
            <p className="text-zinc-500 mb-6 favorites-description">
              Based on your saved courses in Physics and Math.
            </p>
            <Button className="bg-zinc-900 text-white rounded-lg">
              View Recommended
            </Button>
          </div>
          <div className="flex gap-4">
            {[
              { title: "Relativity Intro", icon: <Zap />, meta: "4.8 Rating" },
              { title: "Linear Algebra", icon: <Ruler />, meta: "Top Rated" },
            ].map((item, i) => (
              <Card key={i} className="w-40 p-6 ring-0 shadow-sm">
                <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {item.icon}
                </div>
                <h5 className="font-bold text-sm">{item.title}</h5>
                <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
                  {item.meta}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FavoritesPage;