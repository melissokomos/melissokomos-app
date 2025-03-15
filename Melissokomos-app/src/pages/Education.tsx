import React from "react";
import { Search, BookOpen, Video, Filter, ArrowUpRight, MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data
const articles = [
  {
    id: 1,
    title: "The Complete Guide to Beehive Maintenance",
    description: "Learn essential maintenance techniques to keep your hives healthy year-round.",
    image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVla2VlcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    category: "Maintenance",
    readTime: "10 min read",
    likes: 124,
    comments: 32,
    date: "May 15, 2023"
  },
  {
    id: 2,
    title: "Identifying and Treating Common Bee Diseases",
    description: "A comprehensive guide to spot signs of disease and implement effective treatments.",
    image: "https://images.unsplash.com/photo-1587236810526-c1d89a0726af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVla2VlcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    category: "Health",
    readTime: "15 min read",
    likes: 246,
    comments: 45,
    date: "June 3, 2023"
  },
  {
    id: 3,
    title: "Maximizing Honey Production: Advanced Techniques",
    description: "Strategies to optimize your colony management for increased honey yields.",
    image: "https://images.unsplash.com/photo-1564559421438-6c31a33ebba4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmVla2VlcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    category: "Production",
    readTime: "12 min read",
    likes: 183,
    comments: 29,
    date: "July 8, 2023"
  },
  {
    id: 4,
    title: "Seasonal Beekeeping: Month-by-Month Guide",
    description: "A calendar-based approach to beekeeping tasks throughout the year.",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJlZWtlZXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    category: "Seasonal",
    readTime: "20 min read",
    likes: 298,
    comments: 56,
    date: "April 23, 2023"
  }
];

const videos = [
  {
    id: 1,
    title: "How to Perform a Hive Inspection",
    description: "Step-by-step guide to properly inspecting your beehive.",
    thumbnail: "https://images.unsplash.com/photo-1622870707714-3d6ef4b47a25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGJlZWtlZXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    category: "Tutorial",
    length: "15:24",
    views: 12453,
    date: "Jan 12, 2023"
  },
  {
    id: 2,
    title: "Honey Extraction for Beginners",
    description: "Learn the basics of extracting honey from your hives.",
    thumbnail: "https://images.unsplash.com/photo-1566870575323-322c0bfd82fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlZWtlZXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    category: "Tutorial",
    length: "22:56",
    views: 9872,
    date: "Feb 28, 2023"
  },
  {
    id: 3,
    title: "Queen Rearing Masterclass",
    description: "Advanced techniques for breeding and raising queen bees.",
    thumbnail: "https://images.unsplash.com/photo-1578414050972-12cf245270d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGJlZWtlZXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    category: "Advanced",
    length: "45:12",
    views: 7632,
    date: "Mar 17, 2023"
  }
];

const Education: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Education Center</h1>
          <p className="text-muted-foreground mt-1">
            Expand your beekeeping knowledge with our learning resources
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for articles, videos, or topics" 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">
            <BookOpen className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="mr-2 h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="courses">
            Courses
          </TabsTrigger>
          <TabsTrigger value="community">
            Community
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3">{article.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{article.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <Button variant="ghost" className="flex items-center text-primary text-sm w-full justify-between">
                    <span>Read Article</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-t-8 border-r-8 border-b-8 border-transparent border-r-white ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.length}
                  </div>
                  <Badge className="absolute top-3 left-3">{video.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{video.views.toLocaleString()} views</span>
                    <span className="mx-2">•</span>
                    <span>{video.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <Button variant="ghost" className="flex items-center text-primary text-sm w-full justify-between">
                    <span>Watch Video</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-lg font-medium mb-4">Courses Coming Soon!</div>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              We're developing comprehensive beekeeping courses. Stay tuned for immersive learning experiences tailored to your skill level.
            </p>
            <Button>Get Notified</Button>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-lg font-medium mb-4">Community Forum Coming Soon!</div>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect with fellow beekeepers, share knowledge, and participate in discussions. Our community forum will launch shortly.
            </p>
            <Button>Get Notified</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Education;
