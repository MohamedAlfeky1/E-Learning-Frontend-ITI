import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  // ShoppingCart,
  // Play,
  // Plus,
  FileText,
  Zap,
  Ruler,
} from "lucide-react";

export default function FavoritesPage() {
  return (
    <div
      className="min-h-screen text-white p-6 md:p-12 font-sans"
      style={{
        backgroundColor: "#F9F9FF",
      }}
    >
      {/* Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p
            className="text-indigo-500 text-xs font-bold tracking-widest uppercase mb-2"
            style={{
              color: "#3525CD",
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "Inter",
            }}
          >
            Saved Content
          </p>
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              color: "#141B2B",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 800,
              fontSize: "48px",
            }}
          >
            Favorites
          </h1>
          <p
            className="text-muted-foreground max-w-md"
            style={{
              color: "#464555",
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Your curated collection of premium courses and study guides.
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-3xl font-bold"
            style={{
              color: "#3525CD",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            12
          </span>
          <p
            className="text-xs uppercase"
            style={{
              color: "#464555",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "10px",
            }}
          >
            Total Items
          </p>
        </div>
      </header>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="mb-10">
        <TabsList
          className="border-zinc-800 flex gap-2"
          style={{
            backgroundColor: "#F9F9FF",
            fontWeight: 600,
          }}
        >
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full"
            style={{
              fontFamily: "Inter",
              fontWeight: 600,
            }}
          >
            All Favorites
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#F1F3FF",
              color: "#464555",
              fontWeight: 600,
            }}
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#F1F3FF",
              color: "#464555",
              fontWeight: 600,
            }}
          >
            Lessons
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-[#3525CD] data-[state=active]:text-white px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#F1F3FF",
              color: "#464555",
              fontWeight: 600,
            }}
          >
            Resources
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Featured Card */}
        <Card className="lg:col-span-2 border-none overflow-hidden bg-white text-black flex flex-col md:flex-row h-[400px]">
          <div className="md:w-1/2 bg-zinc-900 flex items-center justify-center p-8">
            {/* Visual Placeholder */}
            <div className="relative w-32 h-32 border-8 border-zinc-800 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-zinc-700 rotate-45" />
            </div>
          </div>
          <CardContent className="md:w-1/2 p-8 flex flex-col justify-between relative">
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
                  className="px-3 py-1"
                  style={{
                    backgroundColor: "#6BFF8F",
                    color: "#002109",
                    fontFamily: "Inter",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  ADVANCED LEVEL
                </Badge>
                <span className="text-xs" style={{ color: "#464555" }}>
                  🕒 12h 45m
                </span>
              </div>
              <h2
                className="text-3xl font-extrabold leading-tight mb-4"
                style={{
                  color: "#141B2B",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "30px",
                  fontWeight: 800,
                }}
              >
                Quantum Physics: Beyond the Standard Model
              </h2>
              <p
                style={{
                  color: "#464555",
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Dive deep into the mysteries of particle physics and wave
                functions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-grow"
                style={{
                  background: "linear-gradient(to right, #3525CD, #712AE2)",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
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
          <Card className="bg-indigo-50 border-none p-4 flex flex-row items-center gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <FileText color="#712AE2" />
            </div>
            <div>
              <h4 className="font-bold text-black">Calculus Cheat Sheet</h4>
              <p className="text-xs text-zinc-500">PDF Document • 4.2 MB</p>
            </div>
          </Card>

          <Card className="flex-grow border-none p-8 flex flex-col justify-between">
            <div className="flex justify-between">
              <Badge
                className=""
                style={{
                  backgroundColor: "#EADDFF",
                  color: "#25005A",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "10px",
                }}
              >
                MATHEMATICS
              </Badge>
              <Heart className="text-red-500 w-5 h-5" />
            </div>
            <CardHeader className="p-0 mt-4">
              <CardTitle
                className="text-2xl"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                Multivariable Calculus Mastery
              </CardTitle>
              <p
                className="text-sm text-zinc-500"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                Master 3D graphing and partial derivatives.
              </p>
            </CardHeader>
            <Button
              variant="outline"
              className="w-full mt-6 border-2 border-indigo-100 rounded-md bg-white"
              style={{
                color: "#3525CD",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              Add to Cart • $49.00
            </Button>
          </Card>
        </div>
      </div>

      {/* Recommended Section */}
      <Card className="bg-indigo-50 border-none p-10 text-black">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="max-w-md">
            <Badge
              variant="outline"
              className="text-indigo-500 border-indigo-200 mb-4"
            >
              RECOMMENDED FOR YOU
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Similar to your favorites
            </h2>
            <p className="text-zinc-500 mb-6">
              Based on your saved courses in Physics and Math.
            </p>
            <Button className="bg-zinc-900 text-white">View Recommended</Button>
          </div>
          <div className="flex gap-4">
            {[
              { title: "Relativity Intro", icon: <Zap />, meta: "4.8 Rating" },
              { title: "Linear Algebra", icon: <Ruler />, meta: "Top Rated" },
            ].map((item, i) => (
              <Card key={i} className="w-40 p-6 border-none shadow-sm">
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
