const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  products = Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  products = Product.fetchAll().then(([rows, fieldNames]) => {
    console.log("shop.js\n", products);
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log("prodId", prodId);
  Product.findById(prodId).then(([product]) => {
    console.log("productDetail", product);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    Product.fetchAll()
      .then(([products, fields]) => {
        {
          for (product of products) {
            const cartProductData = cart.products.find(
              (prod) => prod.id === product.id
            );
            if (cartProductData) {
              cartProducts.push({
                productData: product,
                qty: cartProductData.qty,
              });
            }
          }
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            products: cartProducts,
            totalPrice: cart.totalPrice,
          });
        }
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(([product]) => {
      Cart.addProduct(product.id, product.price, () => {
        console.log("productDetail", prodId);
        res.redirect("/cart");
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(([product]) => {
      Cart.deleteProduct(product.id, product.price, () => {
        console.log("productDetail", prodId);
        res.redirect("/cart");
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
