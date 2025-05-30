import User from "@models/users.model";
import Book from "@models/book.model";
import Review from "@models/review.model";
import logger from "@utils/pino";
import { generate_Hash_Password } from "@services/generalHelper.service";

async function seedDummyData() {
  try {

    const usersPayload = [
      {
        name: "Alice Johnson",
        username: "alicej",
        email: "alice@example.com",
        password: await generate_Hash_Password("alicej"),
        role: "user",
        is_active: true,
        is_verified: true,
      },
      {
        name: "Bob Smith",
        username: "bobsmith",
        email: "bob@example.com",
        password: await generate_Hash_Password("bobsmith"),
        role: "user",
        is_active: true,
        is_verified: true,
      },
      {
        name: "dhanraj Admin",
        username: "dhanrajadmin",
        email: "dhanraj@example.com",
        password: await generate_Hash_Password("dhanrajadmin"),
        role: "admin",
        is_active: true,
        is_verified: true,
      },
    ];

    const insertedUsers = [];

    for (const userData of usersPayload) {
      const exists = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
      if (!exists) {
        const newUser = await User.create(userData);
        insertedUsers.push(newUser);
      } else {
        logger.info(`User already exists: ${userData.email}`);
        insertedUsers.push(exists);
      }
    }

    const booksPayload = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        description: "A novel set in the Jazz Age...",
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        description: "A story about totalitarianism...",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        description: "A novel about racial injustice...",
      },
    ];

    const insertedBooks = [];

    for (const bookData of booksPayload) {
      const exists = await Book.findOne({ title: bookData.title });
      if (!exists) {
        const newBook = await Book.create({ ...bookData, averageRating: 0, reviews: [] });
        insertedBooks.push(newBook);
      } else {
        logger.info(`Book already exists: ${bookData.title}`);
        insertedBooks.push(exists);
      }
    }

    const reviewsPayload = [
      {
        book: insertedBooks[0]._id,
        user: insertedUsers[0]._id,
        rating: 5,
        comment: "Loved the storytelling and characters!",
      },
      {
        book: insertedBooks[0]._id,
        user: insertedUsers[1]._id,
        rating: 4,
        comment: "Great classic but a bit slow at times.",
      },
      {
        book: insertedBooks[1]._id,
        user: insertedUsers[0]._id,
        rating: 5,
        comment: "A terrifying yet important book.",
      },
    ];

    const insertedReviews = [];

    for (const reviewData of reviewsPayload) {
      const exists = await Review.findOne({
        book: reviewData.book,
        user: reviewData.user,
      });

      if (!exists) {
        const newReview = await Review.create(reviewData);
        insertedReviews.push(newReview);
      } else {
        logger.info(`Review already exists for user ${reviewData.user} on book ${reviewData.book}`);
        insertedReviews.push(exists);
      }
    }

    for (const book of insertedBooks) {
      const bookReviews = insertedReviews.filter((r) => r.book.toString() === book._id.toString());
      const avgRating = bookReviews.length
        ? bookReviews.reduce((acc, cur) => acc + cur.rating, 0) / bookReviews.length
        : 0;

      book.reviews = bookReviews.map((r) => r._id);
      book.averageRating = avgRating;
      await book.save();
    }

    logger.info("Dummy data seeded successfully ");
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding dummy data: ${error}`);
    process.exit(1);
  }
}

seedDummyData();
