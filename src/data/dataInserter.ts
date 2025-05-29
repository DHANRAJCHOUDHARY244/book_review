import mongoose from "mongoose";
import User from "@models/users.model";
import Book from "@models/book.model";
import Review from "@models/review.model";

async function seedDummyData() {
  try {
    await mongoose.connect("mongodb://localhost:27017/your-db-name");

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Insert users
    const users = await User.insertMany([
      {
        name: "Alice Johnson",
        username: "alicej",
        email: "alice@example.com",
        password: "hashedpassword1", // use bcrypt hashed passwords in real use
        role: "customer",
        is_verified: true,
      },
      {
        name: "Bob Smith",
        username: "bobsmith",
        email: "bob@example.com",
        password: "hashedpassword2",
        role: "customer",
        is_verified: true,
      },
      {
        name: "Charlie Admin",
        username: "charlieadmin",
        email: "charlie@example.com",
        password: "hashedpassword3",
        role: "admin",
        is_verified: true,
      },
    ]);

    // Insert books
    const books = await Book.insertMany([
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        description: "A novel set in the Jazz Age...",
        averageRating: 0,
        reviews: [],
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        description: "A story about totalitarianism...",
        averageRating: 0,
        reviews: [],
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        description: "A novel about racial injustice...",
        averageRating: 0,
        reviews: [],
      },
    ]);

    // Insert reviews (link to users and books)
    const reviews = await Review.insertMany([
      {
        book: books[0]._id,
        user: users[0]._id,
        rating: 5,
        comment: "Loved the storytelling and characters!",
      },
      {
        book: books[0]._id,
        user: users[1]._id,
        rating: 4,
        comment: "Great classic but a bit slow at times.",
      },
      {
        book: books[1]._id,
        user: users[0]._id,
        rating: 5,
        comment: "A terrifying yet important book.",
      },
    ]);

    // Update books with reviews and averageRating
    for (const book of books) {
      const bookReviews = reviews.filter((r) => r.book.toString() === book._id.toString());
      const avgRating = bookReviews.length
        ? bookReviews.reduce((acc, cur) => acc + cur.rating, 0) / bookReviews.length
        : 0;

      book.reviews = bookReviews.map((r) => r._id);
      book.averageRating = avgRating;
      await book.save();
    }

    console.log("Dummy data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    process.exit(1);
  }
}

seedDummyData();
