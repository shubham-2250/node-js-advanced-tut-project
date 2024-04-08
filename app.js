const express = require("express");
const bodyParser = require("body-parser");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const pageNotFoundRoutes = require("./routes/page-not-found");
const sequelize = require("./utils/database");
const path = require("path");
const rootDir = require("./utils/path");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    User.findByPk(1).then((user) => {
      req.user = user;
      next();
    });
  });
});

//registering routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFoundRoutes);

//relations in database
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync()
  .sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({
        name: "Shubh",
        email: "shubhamverma2250@gmail.com",
      });
    }
  })
  .catch((err) => console.log(err));

app.listen(8000);
// const server = http.createServer(app);

// server.listen(8000);
