const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [150, "Title cannot exceeds 200 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Please give a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please descripe your experience"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.calculateNumAndAvgRating = async function (productID) {
  const result = await this.aggregate([
    { $match: { product: productID } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productID },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateNumAndAvgRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateNumAndAvgRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
