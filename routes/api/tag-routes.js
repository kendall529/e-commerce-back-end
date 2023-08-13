const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const records = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'products',
        }
      ]
    });

    console.log(records);

    const tags = records.map((record) => record.get({ plain: true }));

    console.log(tags);

    res.json(tags);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'tag-id',
        },
      ]
    });

    res.json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({

      tag_name: req.body.tag_name,

    });

    res.status(20).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const { tag_id } = req.params;
    const record = await Tag.update(req.body.tag_name, {
      where: {
        tag_id,
      },
    });

    res.json(record);

  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const { tag_id } = req.params;
    const record = await Tag.destroy(req.body.tag_name, {
      where: {
        tag_id,
      },
    });

    res.json(record);

  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
