// This type represents the gig data structure
export type Gig = {
  id: string;
  title: string;
  message: string;
  budget: number;
  images: string[];
  status: "available" | "ongoing" | "done";
  userId: string;
  deadline: string;
};

export const GIGS_DATA: Gig[] = [
  {
    id: "1",
    title: "Professional Web Development Services",
    message:
      "I will create a responsive, modern website tailored to your needs using the latest web technologies.",
    budget: 500,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    status: "available",
    deadline: "2024-09-14T14:54:29.213Z",
    userId: "773waseww63r2yzn",
  },
  {
    id: "2",
    title: "Custom Logo Design",
    message:
      "I will create a unique and memorable logo that represents your brand.",
    budget: 100,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    status: "available",
    deadline: "2024-09-14T14:54:29.213Z",
    userId: "773waseww63r2yzn",
  },
  {
    id: "3",
    title: "Social Media Marketing",
    message:
      "I will help you grow your online presence and reach your target audience.",
    budget: 200,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    status: "available",
    deadline: "2024-09-14T14:54:29.213Z",
    userId: "773waseww63r2yzn",
  },
  {
    id: "4",
    title: "Mobile App Development",
    message: "I will create a custom mobile app for your business or idea.",
    budget: 1000,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    status: "available",
    deadline: "2024-09-14T14:54:29.213Z",
    userId: "773waseww63r2yzn",
  },
  {
    id: "5",
    title: "Content Writing",
    message:
      "I will write high-quality content for your website, blog, or social media.",
    budget: 50,
    images: ["/placeholder.svg?height=400&width=600"],
    status: "available",
    deadline: "2024-09-14T14:54:29.213Z",
    userId: "773waseww63r2yzn",
  },
];
