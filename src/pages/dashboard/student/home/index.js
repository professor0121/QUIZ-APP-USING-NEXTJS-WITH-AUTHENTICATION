import Link from "next/link";
import Sidebar from "@/components/student/sidebar";
export default function Home() {
  return (
    <div className="flex">
        <Sidebar />
    <div className="bg-gray-100 ml-[16rem] w-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Welcome to Student Learning Hub</h1>
        <p className="mt-4 text-lg">Explore courses and start your journey today!</p>
        <Link href="/courses">
          <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Browse Courses
          </button>
        </Link>
      </section>

      {/* Courses Section */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Courses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-lg"/>
              <h3 className="text-xl font-bold mt-4">{course.title}</h3>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <Link href={`/courses/${course.id}`}>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                  Learn More
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-200 text-center">
        <h2 className="text-3xl font-bold mb-6">Explore Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <div key={index} className="bg-blue-600 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-blue-700">
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">What Students Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
              <h3 className="text-lg font-bold mt-4">{testimonial.name}</h3>
              <p className="text-gray-500">{testimonial.course}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold">Start Learning Today!</h2>
        <p className="mt-2 text-lg">Join thousands of students in learning new skills.</p>
        <Link href="/signup">
          <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Sign Up Now
          </button>
        </Link>
      </section>
    </div>
    </div>

  );
}

// Sample Data
const courses = [
  { id: 1, title: "Web Development", description: "Learn HTML, CSS, JavaScript, and more.", image: "/course1.jpg" },
  { id: 2, title: "Data Science", description: "Master Python, ML, and AI techniques.", image: "/course2.jpg" },
  { id: 3, title: "Graphic Design", description: "Create stunning visuals with Adobe tools.", image: "/course3.jpg" },
];

const categories = ["Programming", "Data Science", "Design", "Marketing", "Business"];

const testimonials = [
  { name: "John Doe", course: "Web Development", feedback: "Amazing course! I learned so much." },
  { name: "Jane Smith", course: "Data Science", feedback: "Helped me land my first job in AI!" },
];
