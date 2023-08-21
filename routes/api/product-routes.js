const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const records = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'tags'
        },
      ]
    });

    const products = records.map((record) => record.get({ plain: true }));

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const record = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'tags'
        },
      ]
    });

    res.json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
router.post('/products', async (req, res) => {
  try {
    console.log(req.body.tag_ids); // Debugging statement
    const product = await Product.create(req.body);
    
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tag_ids.length) {
      const productTagIdArr = req.body.tag_ids.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      
      // if no product tags, just respond
      await ProductTag.bulkCreate(productTagIdArr);
    }
    
    res.status(201).json({ product });
    
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Remove and add tags sequentially
      await ProductTag.destroy({ where: { id: productTagsToRemove } });
      await ProductTag.bulkCreate(newProductTags);
    }

    // Fetch and send updated product
    const updatedProduct = await Product.findByPk(req.params.id);
    return res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!productData) {
      res.status(404).json({ msg: 'No product found with this id.'})

    }
    res.status(200).json(productData);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
