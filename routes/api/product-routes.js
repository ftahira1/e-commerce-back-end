const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all categories
  try {
    const productData = await Product.findAll({
     // be sure to include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag}],
    });
    res.status(200).json(productData);
    }
    catch (err) {
      res.status(500).json(err);
    }
    });
    
    router.get('/:id', async (req, res) => {
    try {
      // find one product by its `id` value
      const productData = await Product.findByPk(req.params.id, {
        // be sure to include its associated Category and Tag data
        include:[{model: Category}, { model: Tag}],
      });
      if (!productData) {
        res.status(404).json({message: "No product found with that id!"});
        return;
      }
      res.status(200).json(productData);
      } catch(err) {
        res.status(500).json(err);
      }
    });
    
    router.post('/', async (req, res) => {
      // create a new product
      try {
        const productData = await Product.create(req.body);
        res.status(200).json(productData);
      } catch (err) {
        res.status(400).json(err);
      }
    });
    
    router.put('/:id', async (req, res) => {
      // update a product by its `id` value
      try {
        const productData = await Product.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        if (!productData[0]) {
          res.status(404).json({message: "No product found with this id!"});
          return;
        }
        res.status(200).json(productData);
      } catch (err) {
        res.status(500).json(err);
      }
    });
    
    router.delete('/:id', async (req, res) => {
      // delete a product by its `id` value
      try {
        const productData = await Product.destroy({
          where: {
            id: req.params.id,
          },
        });
        if (!productData) {
          res.status(404).json({message: "No product found with this id!"});
          return;
        }
        res.status(200).json(productData);
      }
      catch (err) {
        res.status(500).json(err);
        }
    });
module.exports = router;
