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
        const product = await Product.create(req.body);
      
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = await req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
          return res.status(200).json(productTagIds);
        }
        // if no product tags, just respond
        else {
          res.status(200).json(product);
        }
        
      } catch(err) {
        console.log(err);
        res.status(400).json(err);
      }
    });
    
    router.put('/:id', async (req, res) => {
      // update a product by its `id` value
      try {
        const product = await Product.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
            // find all associated tags from ProductTag
        const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
          
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
            // figure out which ones to remove
            const productTagsToRemove = productTags
              .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
              .map(({ id }) => id);
      
            // run both actions
            const updatedProductTags = [
              await ProductTag.destroy({ where: { id: productTagsToRemove } }),
              await ProductTag.bulkCreate(newProductTags),
            ];
            res.json(updatedProductTags);
        } catch(err) {
            console.log(err);
            res.status(400).json(err);
          };
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
