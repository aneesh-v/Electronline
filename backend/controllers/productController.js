import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  public
const getProducts = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword ? {
		name: {
			$regex: req.query.keyword,
			$options: 'i'
		}
	} : {}

	const products = await Product.find({...keyword });
	res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Delete single product
// @route   DELETE /api/products/:id
// @access  private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: 'Product removed successfully' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Create single product
// @route   POST /api/products
// @access  private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample brand',
		category: 'Sample catetory',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample description',
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc    Update single product
// @route   PUT /api/products
// @access  private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		image,
		brand,
		category,
		countInStock,
		description,
	} = req.body;
	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
		product.description = description;

		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Create product review
// @route   PUT /api/products/:id/reviews
// @access  private/Admin
const createProductreview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(r) => r.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewd.');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, rev) => rev.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		res.status(201).json({message: 'review added.'});
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductreview
};
