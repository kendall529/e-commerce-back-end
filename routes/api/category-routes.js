const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const records = await Category.findAll({
      include: [
        {
          model: Product,
        }
      ]
    });

    const categories = records.map((record) => record.get({ plain: true }));

    res.json(categories);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const record = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
        },
      ]
    });

    res.json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({

      category_name: req.body.category_name,

    });

    res.status(201).json(categoryData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const record = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.json(record);

  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const record = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!record) {
      res.status(404).json({ msg: 'No category found with this id.' });

      return;
    }

    res.json(record);

  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
