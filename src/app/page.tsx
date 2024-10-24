import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Code, Pencil, Camera, Music } from "lucide-react";

const popularCategories = [
  { name: "Web Development", icon: Code },
  { name: "Graphic Design", icon: Pencil },
  { name: "Photography", icon: Camera },
  { name: "Music & Audio", icon: Music },
];

const featuredFreelancers = [
  {
    name: "Alice Johnson",
    title: "Full Stack Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Bob Smith",
    title: "Graphic Designer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Carol Williams",
    title: "Content Writer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "David Brown",
    title: "Video Editor",
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find the perfect freelance services for your business
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Work with talented freelancers, deliver quality work, and grow
                  your business.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Search for services"
                    type="search"
                  />
                  <Button type="submit" disabled>
                    <Search className="h-4 w-4 mr-2" color="white" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularCategories.map((category, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center justify-center p-4 hover:bg-muted transition-colors"
                >
                  <category.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold text-center">
                    {category.name}
                  </h3>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Featured Freelancers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFreelancers.map((freelancer, index) => (
                <Card key={index} className="flex flex-col items-center p-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      alt={freelancer.name}
                      src={freelancer.avatar}
                    />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {freelancer.title}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join Freelance Hub today and connect with top talent from
                  around the world.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/freelancers">
                  <Button>Find Talent</Button>
                </Link>
                <Link href="/gigs">
                  <Button variant="outline">Find Work</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2023 Freelance Hub. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Homepage;
